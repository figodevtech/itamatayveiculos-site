export const PUBLIC_TOPICS = ["vehicles", "shorts", "banners", "settings"] as const;
export type PublicTopic = (typeof PUBLIC_TOPICS)[number];

export interface RevalidationEvent {
  eventId: string;
  topics: PublicTopic[];
  vehicleIds: number[];
}

export function parseRevalidationEvent(value: unknown): RevalidationEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Evento inválido.");
  }
  const { eventId, topics, vehicleIds } = value as Record<string, unknown>;
  if (typeof eventId !== "string" || !/^[a-zA-Z0-9:_-]{1,128}$/.test(eventId)) {
    throw new Error("Identificador do evento inválido.");
  }
  if (!Array.isArray(topics) || topics.length < 1 || topics.length > 4 ||
      topics.some(topic => !PUBLIC_TOPICS.includes(topic))) {
    throw new Error("Tópicos inválidos.");
  }
  if (!Array.isArray(vehicleIds) || vehicleIds.length > 500 ||
      vehicleIds.some(id => !Number.isSafeInteger(id) || id <= 0)) {
    throw new Error("Identificadores de veículos inválidos.");
  }
  if (topics.includes("vehicles") && vehicleIds.length === 0) {
    throw new Error("Informe os veículos alterados.");
  }
  return {
    eventId,
    topics: [...new Set(topics)] as PublicTopic[],
    vehicleIds: [...new Set(vehicleIds)] as number[],
  };
}

export function getRevalidationTargets(event: RevalidationEvent) {
  const tags = new Set<string>();
  const paths = new Set<string>();
  if (event.topics.includes("vehicles")) {
    tags.add("catalog");
    tags.add("shorts");
    for (const path of ["/", "/veiculos", "/veiculos/repasses", "/shorts"]) paths.add(path);
    for (const id of event.vehicleIds) {
      tags.add(`vehicle:${id}`);
      paths.add(`/veiculos/${id}`);
    }
  }
  if (event.topics.includes("shorts")) {
    tags.add("shorts");
    paths.add("/shorts");
    for (const id of event.vehicleIds) paths.add(`/veiculos/${id}`);
  }
  if (event.topics.includes("banners")) {
    tags.add("banners");
    paths.add("/");
  }
  if (event.topics.includes("settings")) {
    tags.add("settings");
    paths.add("/");
  }
  return { tags: [...tags], paths: [...paths] };
}
