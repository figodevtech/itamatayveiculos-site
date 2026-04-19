import { createClient } from "@/lib/supabase/server";
import { AppSettings } from "@/types/settings";

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

  return data;
}
