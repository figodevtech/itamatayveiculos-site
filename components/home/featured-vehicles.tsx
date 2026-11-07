import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { HomeVehicleFeed } from "@/components/home/home-vehicle-feed";
import { getHomeVehiclesPage } from "@/services/vehicles";
import { getAppSettings } from "@/services/settings";

export async function FeaturedVehicles() {
  await connection();
  const result = await Promise.all([getHomeVehiclesPage(), getAppSettings()]).catch(error => {
    console.error("Home vehicles unavailable", error);
    return null;
  });
  if (!result) return (
    <section className="bg-secondary/50 px-4 py-12 text-center" aria-label="Veículos em destaque">
      <h2 className="mb-3 font-mono text-2xl font-bold">Veículos em Destaque</h2>
      <p className="text-muted-foreground">Não foi possível carregar os veículos neste momento.</p>
      <form action="/" method="get" className="mt-4"><Button type="submit" variant="outline">Tentar novamente</Button></form>
    </section>
  );
  const [page, settings] = result;
  return (
    <section className="bg-secondary/50 py-12 lg:py-16" aria-labelledby="featured-vehicles-title">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 id="featured-vehicles-title" className="font-mono text-2xl font-bold text-foreground">Veículos em Destaque</h2>
            <p className="mt-1 text-sm text-muted-foreground">Veículos selecionados com os melhores preços</p>
          </div>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/veiculos">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <HomeVehicleFeed initialPage={page} primaryColor={settings?.primary_color} />
        <div className="mt-6 flex justify-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/veiculos">Ver todos os veículos <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FeaturedVehiclesSkeleton() {
  return (
    <section className="bg-secondary/50 py-12 lg:py-16" aria-label="Carregando veículos" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mb-8 font-mono text-2xl font-bold">Veículos em Destaque</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    </section>
  );
}
