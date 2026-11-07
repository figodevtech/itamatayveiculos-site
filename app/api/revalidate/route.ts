import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { getRevalidationTargets, parseRevalidationEvent } from "@/lib/revalidation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.SITE_REVALIDATE_SECRET;
  if (!secret || secret.length < 32) {
    return Response.json({ error: "Publicação não configurada." }, { status: 503 });
  }
  const authorization = request.headers.get("authorization") ?? "";
  const hash = (text: string) => createHash("sha256").update(text).digest();
  if (!timingSafeEqual(hash(authorization), hash(`Bearer ${secret}`))) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > 16384) {
    return Response.json({ error: "Evento muito grande." }, { status: 413 });
  }
  let event;
  try {
    event = parseRevalidationEvent(JSON.parse(body));
  } catch {
    return Response.json({ error: "Evento inválido." }, { status: 400 });
  }

  try {
    const startedAt = performance.now();
    const { tags, paths } = getRevalidationTargets(event);
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
    for (const path of paths) revalidatePath(path);
    if (event.topics.includes("settings")) revalidatePath("/", "layout");
    console.info("Site publication confirmed", {
      eventId: event.eventId, topics: event.topics,
      vehicles: event.vehicleIds.length, durationMs: Math.round(performance.now() - startedAt),
    });
    return Response.json({ revalidated: true, eventId: event.eventId }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Site publication failed", { eventId: event.eventId, error });
    return Response.json({ error: "Não foi possível publicar. Tente novamente." }, { status: 500 });
  }
}
