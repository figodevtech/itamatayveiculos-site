"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const bannerData = [
  {
    id: 1,
    image: "/images/banners/qualidade&precojusto.png",
    alt: "qualidade&precojusto",
  },
  {
    id: 2,
    image: "/images/banners/carrosdeleilao.png",
    alt: "carrosdeleilao",
  },
  {
    id: 3,
    image: "/images/banners/diadamulher.png",
    alt: "diadamulher",
  },



]

export function BannerCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  // Initialize carousel count and selection listener
  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Timer logic: Resets on 'current' change (manual navigation) 
  // and respects page visibility
  React.useEffect(() => {
    if (!api) return

    let intervalId: NodeJS.Timeout | null = null

    const startTimer = () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = setInterval(() => {
        api.scrollNext()
      }, 6000)
    }

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer()
      } else {
        startTimer()
      }
    }

    // Only start if tab is visible
    if (!document.hidden) {
      startTimer()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopTimer()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [api, current])

  return (
    <div className="w-full relative group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          duration: 40,
        }}
      >
        <CarouselContent className="ml-0">
          {bannerData.map((item) => (
            <CarouselItem key={item.id} className="pl-0">
              <div className="relative w-full aspect-16/5 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  priority={item.id === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-card/30 bg-foreground/20 text-card hover:bg-card/20 hover:text-card backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => api?.scrollPrev()}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-card/30 bg-foreground/20 text-card hover:bg-card/20 hover:text-card backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => api?.scrollNext()}
          >
            <ArrowRight className="h-6 w-6" />
            <span className="sr-only">Proximo</span>
          </Button>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300 shadow-sm",
                current === index + 1
                  ? "w-8 bg-card"
                  : "w-2 bg-card/50 hover:bg-card/70"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
