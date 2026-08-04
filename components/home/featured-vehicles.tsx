import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { getAppSettings } from "@/services/settings";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export async function FeaturedVehicles() {
  const [vehicles, settings] = await Promise.all([
    getFeaturedVehicles(),
    getAppSettings(),
  ]);
  const primaryColorStyle = {
    "--featured-primary": settings?.primary_color ?? "var(--primary)",
  } as CSSProperties;

  return (
    <motion.section
      data-motion-reveal=""
      className="bg-secondary/50 py-12 lg:py-16"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div variants={fadeUp} className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-mono text-2xl font-bold text-foreground">
              Veículos em Destaque
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Veículos selecionados com os melhores preços
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-primary hover:bg-[var(--featured-primary)] hover:text-white md:flex"
            style={primaryColorStyle}
            asChild
          >
            <Link href="/veiculos" className="group/link">
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <motion.div key={vehicle.id} variants={fadeUp} className="h-full">
              <VehicleCard
                vehicle={vehicle}
                priority={index < 2}
                primaryColor={settings?.primary_color}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 flex justify-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/veiculos" className="group/link">
              Ver todos os veículos
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
