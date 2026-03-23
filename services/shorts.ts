import { supabase } from "@/lib/supabase/client";
import { Vehicle } from "@/types/vehicle";

export interface ShortVideo {
  id: string;
  vehicle_id: number;
  url: string;
  type: string;
  created_at: string;
  vehicle: Vehicle;
}

export async function getShortsVideos(): Promise<ShortVideo[]> {
  const { data, error } = await supabase
    .from("vehicle_videos")
    .select(`
      *,
      vehicle:vehicles (
        *
      )
    `)
    .eq("type", "shorts")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shorts videos:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    url: row.url,
    type: row.type,
    created_at: row.created_at,
    vehicle: row.vehicle,
  }));
}

export async function getShortByVehicleId(vehicleId: string | number): Promise<ShortVideo | null> {
  const { data, error } = await supabase
    .from("vehicle_videos")
    .select(`
      *,
      vehicle:vehicles (
        *
      )
    `)
    .eq("vehicle_id", vehicleId)
    .eq("type", "shorts")
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    vehicle_id: data.vehicle_id,
    url: data.url,
    type: data.type,
    created_at: data.created_at,
    vehicle: data.vehicle,
  };
}
