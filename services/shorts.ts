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

// Only shorts of vehicles currently for sale are public. `!inner` turns the embed
// into an inner join, so the vehicle filters below drop the video rows themselves.
const SHORT_WITH_VEHICLE = `
  *,
  vehicle:vehicles!inner (
    *
  )
`;
const FOR_SALE_STATUS = "Em venda";

export async function getShortsVideos(): Promise<ShortVideo[]> {
  const { data, error } = await supabase
    .from("vehicle_videos")
    .select(SHORT_WITH_VEHICLE)
    .eq("type", "shorts")
    .eq("vehicle.status", FOR_SALE_STATUS)
    .eq("vehicle.deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shorts videos:", error);
    return [];
  }

  return (data || []).map((row) => ({
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
    .select(SHORT_WITH_VEHICLE)
    .eq("vehicle_id", vehicleId)
    .eq("type", "shorts")
    .eq("vehicle.status", FOR_SALE_STATUS)
    .eq("vehicle.deleted", false)
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
