import { createClient } from "@/lib/supabase/server";
import { Banner } from "@/types/banner";

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return data || [];
}
