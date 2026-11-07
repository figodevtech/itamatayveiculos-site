import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_CACHE_TAGS, readPublicData, vehicleCacheTag } from "@/lib/public-cache";
import {
  decodeHomeVehicleCursor,
  encodeHomeVehicleCursor,
  HOME_VEHICLES_PAGE_SIZE,
  homeVehicleCursorFilter,
  quotePostgrestValue,
} from "@/lib/home-vehicle-cursor";
import type {
  HomeVehiclesPage,
  SellerType,
  Vehicle,
  VehicleCardData,
  VehicleFilterOptions,
  VehicleImage,
  VehicleStatus,
  VehicleWithImages,
} from "@/types/vehicle";

export { InvalidHomeVehicleCursorError } from "@/lib/home-vehicle-cursor";

export const VEHICLE_CARD_COLUMNS = "id,brand,model,version,year,year_model,price,mileage,fuel,body_type,image,city,state,seller_type,is_new,featured,created_at,status";
export const VEHICLE_PUBLIC_COLUMNS = `${VEHICLE_CARD_COLUMNS},fipe,transmission,color,doors,seller,features,description,enable_ai_description,ai_description,engine_size,horsepower`;

type VehicleImageRow = {
  id: string;
  vehicle_id?: number;
  image_url: string;
  sort_order: number;
  file_size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  created_at?: string;
  updated_at?: string;
  active: boolean;
};

export type VehicleRow = {
  id: number | string;
  brand: string;
  model: string;
  version: string;
  year: number;
  year_model: number;
  price: number | string;
  fipe?: number | string | null;
  mileage?: number | null;
  fuel: string;
  transmission: string;
  color: string;
  doors: number;
  body_type: string;
  image: string;
  city: string;
  state: string;
  seller: string;
  seller_type: SellerType;
  features?: string[];
  description: string;
  enable_ai_description: boolean;
  ai_description?: string | null;
  engine_size?: string | null;
  horsepower?: number | null;
  is_new: boolean;
  featured: boolean;
  created_at?: string | null;
  status: VehicleStatus;
  vehicle_images?: VehicleImageRow[];
};

type VehicleCardRow = Pick<VehicleRow,
  "id" | "brand" | "model" | "version" | "year" | "year_model" | "price"
  | "mileage" | "fuel" | "body_type" | "image" | "city" | "state"
  | "seller_type" | "is_new" | "featured" | "created_at" | "status"
>;

function mapVehicleCard(row: VehicleCardRow): VehicleCardData {
  return {
    id: String(row.id),
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    yearModel: row.year_model,
    price: Number(row.price),
    mileage: row.mileage,
    fuel: row.fuel,
    bodyType: row.body_type,
    image: row.image,
    city: row.city,
    state: row.state,
    sellerType: row.seller_type,
    isNew: row.is_new,
    featured: row.featured,
    createdAt: row.created_at ?? undefined,
    status: row.status,
  };
}

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    ...mapVehicleCard(row),
    fipe: row.fipe == null ? undefined : Number(row.fipe),
    transmission: row.transmission,
    color: row.color,
    doors: row.doors,
    seller: row.seller,
    features: row.features || [],
    description: row.description,
    enableAiDescription: row.enable_ai_description,
    aiDescription: row.ai_description,
    engineSize: row.engine_size,
    horsepower: row.horsepower,
  };
}

export const getVehicles = cache(async (): Promise<VehicleCardData[]> => {
  return readPublicData(["vehicles"], [PUBLIC_CACHE_TAGS.catalog], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicles")
      .select(VEHICLE_CARD_COLUMNS)
      .eq("deleted", false)
      .in("status", ["Em venda", "Em breve"])
      .order("featured", { ascending: false })
      .order("status", { ascending: true })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false });

    if (error) throw new Error("Não foi possível carregar os veículos.", { cause: error });
    return (data as unknown as VehicleCardRow[]).map(mapVehicleCard);
  });
});

export const getRepasseVehicles = cache(async (): Promise<VehicleCardData[]> => {
  return readPublicData(["repasses"], [PUBLIC_CACHE_TAGS.catalog], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicles")
      .select(VEHICLE_CARD_COLUMNS)
      .eq("deleted", false)
      .eq("status", "Repasse")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false });

    if (error) throw new Error("Não foi possível carregar os repasses.", { cause: error });
    return (data as unknown as VehicleCardRow[]).map(mapVehicleCard);
  });
});

// Retained for callers that need the complete compact public inventory.
export const getFeaturedVehicles = getVehicles;

export async function getHomeVehiclesPage(cursor?: string): Promise<HomeVehiclesPage> {
  // Validate before touching the cache or database, including when caching is disabled.
  const position = decodeHomeVehicleCursor(cursor);

  return readPublicData(["home-vehicles", cursor ?? "first"], [PUBLIC_CACHE_TAGS.catalog], async () => {
    let query = createPublicClient()
      .from("vehicles")
      .select(VEHICLE_CARD_COLUMNS)
      .eq("deleted", false)
      .in("status", ["Em venda", "Em breve"])
      .order("featured", { ascending: false })
      .order("status", { ascending: true })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .limit(HOME_VEHICLES_PAGE_SIZE + 1);

    if (position) query = query.or(homeVehicleCursorFilter(position));

    const { data, error } = await query;
    if (error) throw new Error("Não foi possível carregar mais veículos.", { cause: error });

    const rows = data as unknown as VehicleCardRow[];
    const hasMore = rows.length > HOME_VEHICLES_PAGE_SIZE;
    const visibleRows = rows.slice(0, HOME_VEHICLES_PAGE_SIZE);
    const lastRow = visibleRows.at(-1);

    return {
      items: visibleRows.map(mapVehicleCard),
      hasMore,
      nextCursor: hasMore && lastRow ? encodeHomeVehicleCursor({
        v: 1,
        featured: lastRow.featured,
        status: lastRow.status as "Em venda" | "Em breve",
        createdAt: lastRow.created_at ?? null,
        id: String(lastRow.id),
      }) : null,
    };
  });
}

export const getVehicleById = cache(async (id: string): Promise<VehicleWithImages | undefined> => {
  if (!/^[1-9]\d{0,18}$/.test(id) || BigInt(id) > BigInt("9223372036854775807")) return undefined;

  return readPublicData(["vehicle", id], [vehicleCacheTag(id)], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicles")
      .select(`${VEHICLE_PUBLIC_COLUMNS},vehicle_images(id,vehicle_id,image_url,sort_order,file_size,mime_type,width,height,created_at,updated_at,active)`)
      .eq("id", id)
      .eq("deleted", false)
      .maybeSingle();

    if (error) throw new Error("Não foi possível carregar este veículo.", { cause: error });
    if (!data) return undefined;

    const row = data as unknown as VehicleRow;
    const vehicle = mapVehicle(row);
    const images: VehicleImage[] = (row.vehicle_images ?? [])
      .filter((image) => image.active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        ...image,
        vehicle_id: image.vehicle_id ?? Number(row.id),
        created_at: image.created_at ?? row.created_at ?? "",
        updated_at: image.updated_at ?? row.created_at ?? "",
      }));

    if (!images.length && row.image) {
      images.push({
        id: "fallback",
        vehicle_id: Number(row.id),
        image_url: row.image,
        sort_order: 0,
        created_at: row.created_at ?? "",
        updated_at: row.created_at ?? "",
        active: true,
      });
    }

    return { ...vehicle, image: images[0]?.image_url ?? row.image, images };
  });
});

export async function getRelatedVehicleCards(
  vehicle: Pick<Vehicle, "id" | "brand" | "bodyType">,
): Promise<VehicleCardData[]> {
  return readPublicData(
    ["related-vehicles", vehicle.id, vehicle.brand, vehicle.bodyType],
    [PUBLIC_CACHE_TAGS.catalog, vehicleCacheTag(vehicle.id)],
    async () => {
      const { data, error } = await createPublicClient()
        .from("vehicles")
        .select(VEHICLE_CARD_COLUMNS)
        .eq("deleted", false)
        .in("status", ["Em venda", "Em breve"])
        .neq("id", vehicle.id)
        .or(`brand.eq.${quotePostgrestValue(vehicle.brand)},body_type.eq.${quotePostgrestValue(vehicle.bodyType)}`)
        .order("featured", { ascending: false })
        .order("status", { ascending: true })
        .order("created_at", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false })
        .limit(3);

      if (error) throw new Error("Não foi possível carregar veículos relacionados.", { cause: error });
      return (data as unknown as VehicleCardRow[]).map(mapVehicleCard);
    },
  );
}

export const getVehicleFilterOptions = cache(async (): Promise<VehicleFilterOptions> => {
  return readPublicData(["vehicle-filters"], [PUBLIC_CACHE_TAGS.catalog], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicles")
      .select("brand,body_type,fuel")
      .eq("deleted", false);

    if (error) throw new Error("Não foi possível carregar os filtros.", { cause: error });

    const values = (key: "brand" | "body_type" | "fuel") => [...new Set(
      data.map((row) => row[key]).filter((value): value is string => typeof value === "string" && value.length > 0),
    )].sort();

    return { brands: values("brand"), bodyTypes: values("body_type"), fuelTypes: values("fuel") };
  });
});

export async function getBrands(): Promise<string[]> {
  return (await getVehicleFilterOptions()).brands;
}

export async function getBodyTypes(): Promise<string[]> {
  return (await getVehicleFilterOptions()).bodyTypes;
}

export async function getFuelTypes(): Promise<string[]> {
  return (await getVehicleFilterOptions()).fuelTypes;
}

export const getBodyTypeCounts = cache(async (): Promise<Record<string, number>> => {
  return readPublicData(["body-type-counts"], [PUBLIC_CACHE_TAGS.catalog], async () => {
    const { data, error } = await createPublicClient()
      .from("vehicles")
      .select("body_type")
      .eq("deleted", false)
      .eq("status", "Em venda");

    if (error) throw new Error("Não foi possível carregar as categorias.", { cause: error });

    const counts: Record<string, number> = {};
    for (const row of data) {
      if (row.body_type) counts[row.body_type] = (counts[row.body_type] ?? 0) + 1;
    }
    return counts;
  });
});
