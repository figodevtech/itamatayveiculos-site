import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VehicleCard } from "@/components/vehicle-card"
import { vehicles } from "@/lib/vehicles"

export function FeaturedVehicles() {
  const featured = vehicles.slice(0, 4)

  return (
    <section className="bg-secondary/50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-mono text-2xl font-bold text-foreground">
              Destaques da semana
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Veiculos selecionados com os melhores precos
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-primary md:flex"
            asChild
          >
            <Link href="/veiculos">
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/veiculos">
              Ver todos os veiculos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
