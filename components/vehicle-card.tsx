import Image from "next/image"
import Link from "next/link"
import { MapPin, Fuel, Gauge, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Vehicle } from "@/lib/vehicles"
import { formatPrice, formatMileage } from "@/lib/vehicles"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/veiculos/${vehicle.id}`}>
      <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-lg h-full">
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {vehicle.isNew && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
              Novo
            </Badge>
          )}
          <div className="absolute right-3 top-3">
            <Badge
              variant="secondary"
              className="bg-card/90 text-card-foreground backdrop-blur-sm"
            >
              {vehicle.sellerType === "concessionaria"
                ? "Concessionaria"
                : vehicle.sellerType === "loja"
                  ? "Loja"
                  : "Particular"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {vehicle.brand}
            </p>
            <h3 className="font-mono text-base font-bold text-card-foreground">
              {vehicle.model}{" "}
              <span className="font-sans text-sm font-normal text-muted-foreground">
                {vehicle.version}
              </span>
            </h3>
          </div>

          <p className="mb-3 font-mono text-xl font-bold text-accent">
            {formatPrice(vehicle.price)}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">
                {vehicle.year}/{vehicle.yearModel}
              </span>
            </div>
            {vehicle.mileage && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gauge className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs">{formatMileage(vehicle.mileage)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Fuel className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">
                {vehicle.city} - {vehicle.state}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
