import "server-only";

import { unstable_cache } from "next/cache";

export const PUBLIC_CACHE_TAGS = {
  catalog: "catalog",
  shorts: "shorts",
  banners: "banners",
  settings: "settings",
} as const;

export function vehicleCacheTag(id: string | number) {
  return `vehicle:${id}`;
}

export function isPublicDataCacheEnabled() {
  return process.env.PUBLIC_DATA_CACHE_ENABLED === "true";
}

/** Every input captured by load must also be included in keyParts. */
export async function readPublicData<T>(
  keyParts: string[],
  tags: string[],
  load: () => Promise<T>,
): Promise<T> {
  if (!isPublicDataCacheEnabled()) return load();

  // Failed reads throw, so an upstream outage never becomes a cached empty list.
  return unstable_cache(load, ["public-data-v1", ...keyParts], {
    tags,
    revalidate: 60,
  })();
}
