import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_CACHE_TAGS, readPublicData, vehicleCacheTag } from "@/lib/public-cache";
import { mapVehicle, VEHICLE_PUBLIC_COLUMNS, type VehicleRow } from "@/services/vehicles";
import type { Vehicle } from "@/types/vehicle";

export interface ShortVideo {
  id: string;
  vehicle_id: number;
  url: string;
  type: string;
  created_at: string;
  vehicle: Vehicle;
}

type ShortVideoRow = Omit<ShortVideo, "vehicle"> & { vehicle: VehicleRow };

function mapShortVideo(row: ShortVideoRow): ShortVideo {
  return { ...row, vehicle: mapVehicle(row.vehicle) };
}

const SHORT_VIDEO_COLUMNS = `id,vehicle_id,url,type,created_at,vehicle:vehicles!inner(${VEHICLE_PUBLIC_COLUMNS})`;

export const getShortsVideos = cache(async (): Promise<ShortVideo[]> => {
  return readPublicData(["shorts"], [PUBLIC_CACHE_TAGS.shorts, PUBLIC_CACHE_TAGS.catalog], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicle_videos")
      .select(SHORT_VIDEO_COLUMNS)
      .eq("type", "shorts")
      .eq("vehicle.deleted", false)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Não foi possível carregar os vídeos.", { cause: error });
    return (data as unknown as ShortVideoRow[]).map(mapShortVideo);
  });
});

export async function getShortByVehicleId(vehicleId: string | number): Promise<ShortVideo | null> {
  const id = String(vehicleId);
  return readPublicData(["vehicle-short", id], [PUBLIC_CACHE_TAGS.shorts, vehicleCacheTag(id)], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicle_videos")
      .select(SHORT_VIDEO_COLUMNS)
      .eq("vehicle_id", id)
      .eq("type", "shorts")
      .eq("vehicle.deleted", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error("Não foi possível carregar o vídeo do veículo.", { cause: error });
    return data ? mapShortVideo(data as unknown as ShortVideoRow) : null;
  });
}

/** The detail page only needs a link target, not the video or joined vehicle. */
export const getShortReferenceByVehicleId = cache(async (
  vehicleId: string | number,
): Promise<{ id: string } | null> => {
  const id = String(vehicleId);
  return readPublicData(["vehicle-short-reference", id], [PUBLIC_CACHE_TAGS.shorts, vehicleCacheTag(id)], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicle_videos")
      .select("id")
      .eq("vehicle_id", id)
      .eq("type", "shorts")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error("Não foi possível consultar o vídeo do veículo.", { cause: error });
    return data ? { id: String(data.id) } : null;
  });
});
