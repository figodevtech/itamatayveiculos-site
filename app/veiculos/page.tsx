import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleListContent } from "@/components/vehicles/vehicle-list-content"
import { getVehicles } from "@/lib/vehicles"

export const metadata = {
  title: "Itamatay Veículos",
  description:
    "Encontre carros com os melhores precos. Filtre por marca, modelo, ano e muito mais.",
}

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  const brand = typeof params.marca === 'string' ? params.marca : '';
  const bodyType = typeof params.tipo === 'string' ? params.tipo : '';
  const fuelType = typeof params.combustivel === 'string' ? params.combustivel : '';
  const priceMinStr = typeof params.precoMin === 'string' ? params.precoMin : '';
  const priceMaxStr = typeof params.precoMax === 'string' ? params.precoMax : '';
  const yearMin = typeof params.anoMin === 'string' ? params.anoMin : '';
  const yearMax = typeof params.anoMax === 'string' ? params.anoMax : '';
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : 'relevance';

  const allVehicles = await getVehicles();
  let filtered = [...allVehicles];

  if (brand && brand !== "all") {
    filtered = filtered.filter((v) => v.brand === brand)
  }
  if (bodyType) {
    filtered = filtered.filter((v) => v.bodyType === bodyType)
  }
  if (fuelType) {
    filtered = filtered.filter((v) => v.fuel === fuelType)
  }
  
  const priceMin = priceMinStr ? parseInt(priceMinStr) : 0;
  const priceMax = priceMaxStr ? parseInt(priceMaxStr) : 400000;
  if (priceMin > 0 || priceMax < 400000) {
    filtered = filtered.filter(
      (v) => v.price >= priceMin && v.price <= priceMax
    )
  }

  if (yearMin && yearMin !== "any") {
    filtered = filtered.filter((v) => v.year >= parseInt(yearMin))
  }
  if (yearMax && yearMax !== "any") {
    filtered = filtered.filter((v) => v.year <= parseInt(yearMax))
  }

  switch (sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price)
      break
    case "year-desc":
      filtered.sort((a, b) => b.year - a.year)
      break
    case "mileage-asc":
      filtered.sort((a, b) => (a.mileage ?? 0) - (b.mileage ?? 0))
      break
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={<VehicleListSkeleton />}>
          <VehicleListContent initialVehicles={filtered} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function VehicleListSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    </div>
  )
}
