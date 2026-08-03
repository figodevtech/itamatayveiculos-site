import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { getAppSettings } from "@/services/settings";

export async function FeaturedVehicles() {
  const [vehicles, settings] = await Promise.all([
    getFeaturedVehicles(),
    getAppSettings(),
  ]);
  const primaryColorStyle = {
    "--featured-primary": settings?.primary_color ?? "var(--primary)",
  } as CSSProperties;

  return (
    <section className="bg-secondary/50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-mono text-2xl font-bold text-foreground">
              Veículos em Destaque
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Veiculos selecionados com os melhores precos
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-primary hover:bg-[var(--featured-primary)] hover:text-white md:flex"
            style={primaryColorStyle}
            asChild
          >
            <Link href="/veiculos">
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              priority={index < 2}
              primaryColor={settings?.primary_color}
            />
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
  );
}
