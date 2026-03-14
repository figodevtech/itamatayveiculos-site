import { supabase } from "@/lib/supabase/client";
import { Vehicle, VehicleWithImages, SellerType, VehicleStatus, VehicleImage } from "@/types/vehicle";

export function mapVehicle(row: any): Vehicle {
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
    .eq("status", "Em venda")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }

  return data.map((row: any) => {
    const vehicle = mapVehicle(row);
    let displayImage = row.image;

    // Filter out inactive images and sort
    const activeImages = row.vehicle_images ? row.vehicle_images.filter((img: any) => img.active) : [];

    if (activeImages.length > 0) {
      const sortedImages = activeImages.sort((a: any, b: any) => a.sort_order - b.sort_order);
      displayImage = vehicle.image;
    }
    return {
      ...vehicle,
      image: displayImage, // Make sure image has the primary configured one or default
    };
  });
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
    .eq("status", "Em venda")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured vehicles:", error);
    return [];
  }

  return data.map((row: any) => {
    const vehicle = mapVehicle(row);
    let displayImage = row.image;

    // Filter out inactive images and sort
    const activeImages = row.vehicle_images ? row.vehicle_images.filter((img: any) => img.active) : [];

    if (activeImages.length > 0) {
      const sortedImages = activeImages.sort((a: any, b: any) => a.sort_order - b.sort_order);
      displayImage = vehicle.image;
    }
    return {
      ...vehicle,
      image: displayImage, // Make sure image has the primary configured one or default
    };
  });
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

  const vehicle = mapVehicle(data);
  let sortedImages: VehicleImage[] = [];

  const activeImages = data.vehicle_images ? data.vehicle_images.filter((img: any) => img.active) : [];

  if (activeImages.length > 0) {
    sortedImages = activeImages.sort((a: any, b: any) => a.sort_order - b.sort_order);
  } else {
    if (data.image) {
      sortedImages = [{
        id: "fallback",
        vehicle_id: data.id,
        image_url: data.image,
        sort_order: 0,
        created_at: data.created_at,
        updated_at: data.created_at,
        active: true,
      }];
    }
  }

  return {
    ...vehicle,
    image: sortedImages.length > 0 ? sortedImages[0].image_url : data.image,
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

export async function getFuelTypes(): Promise<string[]> {
  const { data } = await supabase.from("vehicles").select("fuel").eq("deleted", false);
  if (!data) return [];
  return [...new Set(data.map(v => v.fuel))].sort();
}
