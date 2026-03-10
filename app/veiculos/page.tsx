import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleListContent } from "@/components/vehicles/vehicle-list-content"

export const metadata = {
  title: "Alan Car",
  description:
    "Encontre carros com os melhores precos. Filtre por marca, modelo, ano e muito mais.",
}

export default function VeiculosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={<VehicleListSkeleton />}>
          <VehicleListContent />
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
