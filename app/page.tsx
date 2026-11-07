import { Suspense } from "react";
import { connection } from "next/server";
import { Header } from "@/components/header"
import Link from "next/link"
import { Play } from "lucide-react"

import { Footer } from "@/components/footer"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { HeroSearch } from "@/components/home/hero-search"
import { BrandSection } from "@/components/home/brand-section"
import { FeaturedVehicles, FeaturedVehiclesSkeleton } from "@/components/home/featured-vehicles"
import { ServicesShowcase } from "@/components/home/services-showcase"
import { BodyTypeSection } from "@/components/home/body-type-section"
import { getBanners } from "@/services/banners";
import { getAppSettings } from "@/services/settings";
import { getVehicleFilterOptions } from "@/services/vehicles";

export default async function HomePage() {
  await connection();
  return (
    <div className="flex min-h-screen flex-col ">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="aspect-16/5 w-full animate-pulse bg-muted" aria-label="Carregando destaques" />}>
          <HomeBanners />
        </Suspense>

        {/* Mobile Shorts Banner */}
        <div className="mt-4 px-4 md:hidden">
          <Link href="/shorts" className="block w-full appearance-none outline-none">
            <div
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl p-4 shadow-lg shadow-red-500/30 active:scale-95 transition-all duration-300"
              style={{ background: 'linear-gradient(to right, #f43f5e, #ef4444, #f97316)' }}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-active:bg-white/20 transition-colors" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-black/10 rounded-full blur-lg" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="flex bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-sm ring-1 ring-white/30 relative">
                  <Play className="w-5 h-5 text-white fill-white relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg leading-tight tracking-wide drop-shadow-sm">Assista aos Shorts</span>
                  <span className="text-white/95 text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-90">Veículos em ação</span>
                </div>
              </div>

              <div className="relative z-10 rounded-full border border-red-400 bg-yellow-500 px-2.5 py-1 shadow-sm backdrop-blur-md">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">Novo</span>
              </div>
            </div>
          </Link>
        </div>

        <Suspense fallback={<SearchSkeleton />}>
          <HomeSearch />
        </Suspense>
        <div className="mt-6">
          <BrandSection />
        </div>
        <Suspense fallback={<FeaturedVehiclesSkeleton />}>
          <FeaturedVehicles />
        </Suspense>
        <ServicesShowcase />
        <Suspense fallback={<div className="mx-auto h-72 max-w-7xl animate-pulse bg-muted/30" aria-label="Carregando tipos de veículos" />}>
          <BodyTypeSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

async function HomeBanners() {
  const result = await Promise.all([getBanners(), getAppSettings()]).catch(error => {
    console.error("Home banners unavailable", error);
    return null;
  });
  if (!result) return <BannerCarousel banners={[]} />;
  const [banners, settings] = result;
  return <BannerCarousel banners={banners} interval={settings?.banner_interval} duration={settings?.banner_duration} />;
}

async function HomeSearch() {
  await connection();
  const options = await getVehicleFilterOptions().catch(error => {
    console.error("Home search options unavailable", error);
    return { brands: [] };
  });
  return <HeroSearch brands={options.brands} />;
}

function SearchSkeleton() {
  return (
    <section className="relative z-10 mx-auto mt-5 max-w-6xl px-4 lg:px-6" aria-label="Carregando busca" aria-busy="true">
      <div className="rounded-2xl bg-card p-5 shadow-xl ring-1 ring-border/50 md:p-6">
        <h2 className="mb-4 font-mono text-lg font-bold">Encontre seu próximo veículo</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          {[0, 1, 2, 3].map((index) => <div key={index} className="h-14 flex-1 animate-pulse rounded-md bg-muted" />)}
        </div>
        <div className="mt-5 h-10 border-t border-border pt-4" />
      </div>
    </section>
  );
}
