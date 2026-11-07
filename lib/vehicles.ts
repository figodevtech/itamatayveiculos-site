// Client-safe exports. Database queries live in server-only services.
export * from "@/types/vehicle";
export { formatPrice, formatMileage } from "@/lib/vehicle-format";
