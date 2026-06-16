import { supabase } from "@/lib/supabase/client";
import { Vehicle, VehicleWithImages, SellerType, VehicleStatus, VehicleImage } from "@/types/vehicle";

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

type VehicleRow = {
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
  created_at?: string;
  status: VehicleStatus;
  vehicle_images?: VehicleImageRow[];
};

function getActiveImages(row: VehicleRow) {
  return row.vehicle_images?.filter((img) => img.active) ?? [];
}

function mapVehicleListRow(row: VehicleRow): Vehicle {
  const vehicle = mapVehicle(row);
  let displayImage = row.image;
  const activeImages = getActiveImages(row);

  if (activeImages.length > 0) {
    activeImages.sort((a, b) => a.sort_order - b.sort_order);
    displayImage = vehicle.image;
  }

  return {
    ...vehicle,
    image: displayImage,
  };
}

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: String(row.id),
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    yearModel: row.year_model,
    price: Number(row.price),
    fipe: row.fipe ? Number(row.fipe) : undefined,
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    color: row.color,
    doors: row.doors,
    bodyType: row.body_type,
    image: row.image,
    city: row.city,
    state: row.state,
    seller: row.seller,
    sellerType: row.seller_type as SellerType,
    features: row.features || [],
    description: row.description,
    enableAiDescription: row.enable_ai_description,
    aiDescription: row.ai_description,
    engineSize: row.engine_size,
    horsepower: row.horsepower,
    isNew: row.is_new,
    featured: row.featured,
    createdAt: row.created_at,
    status: row.status as VehicleStatus,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_images (
        id, image_url, sort_order, active
      )
    `)
    .eq("deleted", false)
    .in("status", ["Em venda", "Em breve"])
    .order("featured", { ascending: false })
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }

  return data.map((row) => mapVehicleListRow(row as VehicleRow));
}

export async function getRepasseVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_images (
        id, image_url, sort_order, active
      )
    `)
    .eq("deleted", false)
    .eq("status", "Repasse")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching repasse vehicles:", error);
    return [];
  }

  return data.map((row) => mapVehicleListRow(row as VehicleRow));
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_images (
        id, image_url, sort_order, active
      )
    `)
    .eq("deleted", false)
    .in("status", ["Em venda", "Em breve"])
    .order("featured", { ascending: false })
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured vehicles:", error);
    return [];
  }

  return data.map((row) => mapVehicleListRow(row as VehicleRow));
}

export async function getVehicleById(id: string): Promise<VehicleWithImages | undefined> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_images (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error("Error fetching vehicle by id:", error);
    }
    return undefined;
  }

  const vehicle = mapVehicle(data as VehicleRow);
  let sortedImages: VehicleImage[] = [];

  const vehicleRow = data as VehicleRow;
  const activeImages = getActiveImages(vehicleRow);

  if (activeImages.length > 0) {
    sortedImages = activeImages.sort((a, b) => a.sort_order - b.sort_order).map((img) => ({
      id: img.id,
      vehicle_id: img.vehicle_id ?? Number(vehicleRow.id),
      image_url: img.image_url,
      sort_order: img.sort_order,
      file_size: img.file_size,
      mime_type: img.mime_type,
      width: img.width,
      height: img.height,
      created_at: img.created_at ?? vehicleRow.created_at ?? "",
      updated_at: img.updated_at ?? vehicleRow.created_at ?? "",
      active: img.active,
    }));
  } else {
    if (vehicleRow.image) {
      sortedImages = [{
        id: "fallback",
        vehicle_id: Number(vehicleRow.id),
        image_url: vehicleRow.image,
        sort_order: 0,
        created_at: vehicleRow.created_at ?? "",
        updated_at: vehicleRow.created_at ?? "",
        active: true,
      }];
    }
  }

  return {
    ...vehicle,
    image: sortedImages.length > 0 ? sortedImages[0].image_url : vehicleRow.image,
    images: sortedImages,
  };
}

export async function getBrands(): Promise<string[]> {
  const { data } = await supabase.from("vehicles").select("brand").eq("deleted", false);
  if (!data) return [];
  return [...new Set(data.map(v => v.brand))].sort();
}

export async function getBodyTypes(): Promise<string[]> {
  const { data } = await supabase.from("vehicles").select("body_type").eq("deleted", false);
  if (!data) return [];
  return [...new Set(data.map(v => v.body_type))].sort();
}

export async function getBodyTypeCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("body_type")
    .eq("deleted", false)
    .eq("status", "Em venda");

  if (error) {
    console.error("Error fetching body type counts:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  data.forEach((v: { body_type?: string | null }) => {
    if (v.body_type) {
      counts[v.body_type] = (counts[v.body_type] || 0) + 1;
    }
  });

  return counts;
}

export async function getFuelTypes(): Promise<string[]> {
  const { data } = await supabase.from("vehicles").select("fuel").eq("deleted", false);
  if (!data) return [];
  return [...new Set(data.map(v => v.fuel))].sort();
}
