import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_CACHE_TAGS, readPublicData } from "@/lib/public-cache";
import type { PublicAppSettings } from "@/types/settings";

const DEFAULT_PRIMARY_COLOR = "#1a2744";
const DEFAULT_SECONDARY_COLOR = "#f1f3f7";
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

function getHexColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value)
    ? value
    : fallback;
}

export const getAppSettings = cache(async (): Promise<PublicAppSettings | null> => {
  try {
    return await readPublicData(["app-settings"], [PUBLIC_CACHE_TAGS.settings], async () => {
      const { data, error } = await createPublicClient()
        .from("app_settings")
        .select("banner_interval,banner_duration,primary_color,secondary_color")
        .maybeSingle();

      if (error) throw new Error("Não foi possível carregar as configurações do site.", { cause: error });
      if (!data) return null;

      return {
        banner_interval: data.banner_interval,
        banner_duration: data.banner_duration,
        primary_color: getHexColor(data.primary_color, DEFAULT_PRIMARY_COLOR),
        secondary_color: getHexColor(data.secondary_color, DEFAULT_SECONDARY_COLOR),
      };
    });
  } catch (error) {
    // Settings are optional. Catch outside the shared cache so outages are not cached.
    console.error("Error loading public site settings:", error);
    return null;
  }
});
