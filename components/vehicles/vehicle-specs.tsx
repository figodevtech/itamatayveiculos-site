import { Calendar, Car, DoorOpen, Fuel, Gauge, Paintbrush, Settings, Zap } from "lucide-react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/lib/vehicles";
import { formatMileage } from "@/lib/vehicles";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    { icon: Calendar, label: "Ano", value: `${vehicle.year}/${vehicle.yearModel}` },
    ...(vehicle.mileage
      ? [{ icon: Gauge, label: "Quilometragem", value: formatMileage(vehicle.mileage) }]
      : []),
    ...(vehicle.engineSize
      ? [{
          icon: Zap,
          label: "Motor",
          value: `${vehicle.engineSize} ${vehicle.horsepower ? `- ${vehicle.horsepower}cv` : ""}`,
        }]
      : []),
    { icon: Fuel, label: "Combustível", value: vehicle.fuel },
    { icon: Settings, label: "Câmbio", value: vehicle.transmission },
    { icon: Paintbrush, label: "Cor", value: vehicle.color },
    { icon: DoorOpen, label: "Portas", value: `${vehicle.doors} portas` },
    { icon: Car, label: "Carroceria", value: vehicle.bodyType },
  ];

  return (
    <motion.div
      data-motion-reveal=""
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 font-mono text-lg font-bold text-card-foreground">Ficha técnica</h3>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <motion.div key={spec.label} variants={fadeUp} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="text-sm font-semibold text-card-foreground">{spec.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
