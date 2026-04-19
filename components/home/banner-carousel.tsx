"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Banner } from "@/types/banner";

interface BannerCarouselProps {
  banners: Banner[];
  interval?: number;
  duration?: number;
}

export function BannerCarousel({ 
  banners, 
  interval = 6, 
  duration = 0.4 
}: BannerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Initialize carousel count and selection listener
  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Timer logic: Resets on 'current' change (manual navigation)
  // and respects page visibility
  React.useEffect(() => {
    if (!api || banners.length <= 1) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        api.scrollNext();
      }, interval * 1000);
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    // Only start if tab is visible
    if (!document.hidden) {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [api, current, banners.length, interval]);

  if (banners.length === 0) {
    return (
      <div className="w-full aspect-16/5 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground font-semibold text-lg drop-shadow-sm">Itamatay Veículos</span>
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          duration: duration * 100,
        }}
      >
        <CarouselContent className="ml-0">
          {banners.map((item, index) => (
            <CarouselItem key={item.id} className="pl-0">
              <div className="relative w-full aspect-16/5 overflow-hidden">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                      priority={index === 0}
                      sizes="100vw"
                      quality={75}
                    />
                  </a>
                ) : (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="100vw"
                    quality={75}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons - Only show if more than one banner */}
        {banners.length > 1 && (
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
        )}

        {/* Dot indicators - Only show if more than one banner */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 shadow-sm",
                  current === index + 1
                    ? "w-8 bg-card"
                    : "w-2 bg-card/50 hover:bg-card/70",
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}
