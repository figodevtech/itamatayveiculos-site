import { Header } from "@/components/header"
import Link from "next/link"
import { Play } from "lucide-react"

export const revalidate = 0;
import { Footer } from "@/components/footer"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { HeroSearch } from "@/components/home/hero-search"
import { BrandSection } from "@/components/home/brand-section"
import { FeaturedVehicles } from "@/components/home/featured-vehicles"
import { BodyTypeSection } from "@/components/home/body-type-section"
import { ShortsButton } from "@/components/shorts/shorts-button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header />
      <main className="flex-1">
        <BannerCarousel />

        {/* Mobile Shorts Banner */}
        <div className="md:hidden px-4 mt-4">
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

              <div className="relative z-10 bg-yellow-500 rounded-full px-2.5 py-1 backdrop-blur-md shadow-sm border animate-pulse border-red-400">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">Novo</span>
              </div>
            </div>
          </Link>
        </div>

        <HeroSearch />
        <div className="mt-6">
          <BrandSection />
        </div>
        <FeaturedVehicles />
        <BodyTypeSection />
      </main>
      <Footer />
    </div>
  )
}
