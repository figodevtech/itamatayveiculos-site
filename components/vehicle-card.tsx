import Image from "next/image";
import Link from "next/link";
import { Calendar, Fuel, Gauge, MapPin, Star } from "lucide-react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/lib/vehicles";
import { formatMileage, formatPrice } from "@/lib/vehicles";
import { fadeIn, premiumEase } from "@/lib/motion";

interface VehicleCardProps {
  vehicle: Vehicle;
  priority?: boolean;
  primaryColor?: string;
}

export function VehicleCard({ vehicle, priority, primaryColor }: VehicleCardProps) {
  return (
    <Link href={`/veiculos/${vehicle.id}`} className="block h-full rounded-xl">
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2, ease: premiumEase }}
        className="h-full"
      >
        <Card className="group h-full overflow-hidden border-border bg-card pt-0 transition-shadow duration-200 hover:shadow-lg">
          <div className="relative aspect-16/10 overflow-hidden">
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              priority={priority}
            />
            {vehicle.isNew && (
              <motion.div variants={fadeIn} className="absolute left-3 top-3">
                <Badge className="bg-accent text-accent-foreground">Novo</Badge>
              </motion.div>
            )}
            <motion.div variants={fadeIn} className="absolute right-3 top-3">
              <Badge
                variant="secondary"
                className="bg-card/90 text-card-foreground backdrop-blur-sm"
              >
                {vehicle.sellerType === "dealership"
                  ? "Concessionária"
                  : vehicle.sellerType === "store"
                    ? "Loja"
                    : "Particular"}
              </Badge>
            </motion.div>
            {vehicle.featured && (
              <motion.div variants={fadeIn} className="absolute left-3 top-3">
                <Badge
                  variant="secondary"
                  className={`${primaryColor ? "" : "bg-primary"} text-white backdrop-blur-sm`}
                  style={primaryColor ? { backgroundColor: primaryColor } : undefined}
                >
                  <Star className="h-3.5 w-3.5 shrink-0" /> Destaque
                </Badge>
              </motion.div>
            )}
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

            <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs">{vehicle.year}/{vehicle.yearModel}</span>
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
                <span className="truncate text-xs">{vehicle.city} - {vehicle.state}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.article>
    </Link>
  );
}
