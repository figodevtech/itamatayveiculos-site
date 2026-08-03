import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, CarFront } from "lucide-react";
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

        <div
          className="relative mt-8 overflow-hidden rounded-2xl bg-[var(--featured-primary)] px-6 py-7 text-white shadow-sm sm:px-8"
          style={primaryColorStyle}
        >
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-black/10"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 sm:flex">
                <CarFront className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-mono text-xl font-bold sm:text-2xl">
                  Não encontrou o que procurava?
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-white/80 sm:text-base">
                  Veja também os veículos de repasse disponíveis em nosso estoque.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-white text-[var(--featured-primary)] hover:bg-white/90 sm:w-auto"
              asChild
            >
              <Link href="/veiculos/repasses">
                Ver veículos de repasse
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
