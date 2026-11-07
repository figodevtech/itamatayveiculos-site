import { NextRequest, NextResponse } from "next/server";
import { getHomeVehiclesPage, InvalidHomeVehicleCursorError } from "@/services/vehicles";

export const dynamic = "force-dynamic";

const responseHeaders = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  try {
    const cursors = request.nextUrl.searchParams.getAll("cursor");
    if (cursors.length > 1) throw new InvalidHomeVehicleCursorError();

    const page = await getHomeVehiclesPage(cursors[0]);
    return NextResponse.json(page, { headers: responseHeaders });
  } catch (error) {
    if (error instanceof InvalidHomeVehicleCursorError) {
      return NextResponse.json({ error: error.message }, { status: 400, headers: responseHeaders });
    }

    console.error("Error loading the home inventory:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os veículos. Tente novamente." },
      { status: 503, headers: responseHeaders },
    );
  }
}
