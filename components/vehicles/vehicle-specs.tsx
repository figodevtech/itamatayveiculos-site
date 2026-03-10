import {
  Calendar,
  Fuel,
  Gauge,
  Paintbrush,
  Settings,
  DoorOpen,
  Zap,
  Car,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Vehicle } from "@/lib/vehicles"
import { formatMileage } from "@/lib/vehicles"

interface VehicleSpecsProps {
  vehicle: Vehicle
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    {
      icon: Calendar,
      label: "Ano",
      value: `${vehicle.year}/${vehicle.yearModel}`,
    },
    {
      icon: Gauge,
      label: "Quilometragem",
      value: vehicle.mileage ? formatMileage(vehicle.mileage) : "",
    },
    { icon: Fuel, label: "Combustivel", value: vehicle.fuel },
    { icon: Settings, label: "Cambio", value: vehicle.transmission },
    { icon: Paintbrush, label: "Cor", value: vehicle.color },
    { icon: DoorOpen, label: "Portas", value: `${vehicle.doors} portas` },
    { icon: Zap, label: "Motor", value: `${vehicle.engineSize} - ${vehicle.horsepower}cv` },
    { icon: Car, label: "Carroceria", value: vehicle.bodyType },
  ]

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <h3 className="mb-4 font-mono text-lg font-bold text-card-foreground">
          Ficha tecnica
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {specs.map((spec) => {
            const Icon = spec.icon
            return (
              <div key={spec.label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {spec.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
