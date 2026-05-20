import { createClient } from "@/lib/supabase/server";
import { AppSettings } from "@/types/settings";

const DEFAULT_PRIMARY_COLOR = "#1a2744";
const DEFAULT_SECONDARY_COLOR = "#f1f3f7";
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

function getHexColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value)
    ? value
    : fallback;
}

export async function getAppSettings(): Promise<AppSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching app settings:", error);
    return null;
  }

  return {
    ...data,
    primary_color: getHexColor(data.primary_color, DEFAULT_PRIMARY_COLOR),
    secondary_color: getHexColor(data.secondary_color, DEFAULT_SECONDARY_COLOR),
  };
}
