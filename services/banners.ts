import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_CACHE_TAGS, readPublicData } from "@/lib/public-cache";
import type { Banner } from "@/types/banner";

export const getBanners = cache(async (): Promise<Banner[]> => {
  return readPublicData(["banners"], [PUBLIC_CACHE_TAGS.banners], async () => {
    const { data, error } = await createPublicClient()
      .from("banners")
      .select("id,name,link,order,image_url,active")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error) throw new Error("Não foi possível carregar os banners.", { cause: error });
    return data as Banner[];
  });
});
