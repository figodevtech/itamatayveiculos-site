export type SellerType = "dealership" | "store" | "private";
export type VehicleStatus = "Em venda" | "Vendido" | "Rascunho" | "Pagamento";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  yearModel: number;
  price: number;
  fipe?: number | null;
  mileage?: number | null;
  fuel: string;
  transmission: string;
  color: string;
  doors: number;
  bodyType: string;
  image: string;
  city: string;
  state: string;
  seller: string;
  sellerType: SellerType;
  features: string[];
  description: string;
  enableAiDescription: boolean;
  aiDescription?: string | null;
  engineSize?: string | null;
  horsepower?: number | null;
  isNew: boolean;
  featured: boolean;
  message?: string;
  createdAt?: string;
  status: VehicleStatus;
}

export interface VehicleImage {
  id: string;
  vehicle_id: number;
  image_url: string;
  sort_order: number;
  file_size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface VehicleWithImages extends Vehicle {
  images: VehicleImage[];
}
