"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { premiumEase, subtleTap } from "@/lib/motion";
import type { Banner } from "@/types/banner";

interface BannerCarouselProps {
  banners: Banner[];
  interval?: number;
  duration?: number;
}

export function BannerCarousel({
  banners,
  interval = 6,
  duration = 0.6,
}: BannerCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const didDrag = React.useRef(false);
  const transitionDuration = Math.min(Math.max(duration, 0.2), 0.8);

  const goTo = React.useCallback(
    (index: number) => {
      if (banners.length === 0) return;
      setCurrent((index + banners.length) % banners.length);
    },
    [banners.length],
  );

  React.useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      if (document.hidden) return;
      timeoutId = setTimeout(() => {
        setCurrent((index) => (index + 1) % banners.length);
      }, interval * 1000);
    };

    const handleVisibilityChange = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
      scheduleNext();
    };

    scheduleNext();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [banners.length, current, interval, isPaused]);

  React.useEffect(() => {
    if (current >= banners.length) setCurrent(0);
  }, [banners.length, current]);

  if (banners.length === 0) {
    return (
      <div className="flex aspect-16/5 w-full items-center justify-center bg-muted">
        <span className="text-lg font-semibold text-muted-foreground drop-shadow-sm">
          Itamatay Veículos
        </span>
      </div>
    );
  }

  const activeBanner = banners[current];

  return (
    <section
      aria-label="Destaques"
      aria-roledescription="carrossel"
      className="group relative aspect-16/5 w-full overflow-hidden bg-muted"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(current - 1);
        if (event.key === "ArrowRight") goTo(current + 1);
      }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeBanner.id}
          className="absolute inset-0 touch-pan-y"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.015 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration, ease: premiumEase }}
          drag={shouldReduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => {
            didDrag.current = true;
          }}
          onDragEnd={(_, info) => {
            const swipe = Math.abs(info.offset.x) * info.velocity.x;
            if (info.offset.x < -50 || swipe < -5000) goTo(current + 1);
            if (info.offset.x > 50 || swipe > 5000) goTo(current - 1);
            window.setTimeout(() => {
              didDrag.current = false;
            }, 0);
          }}
        >
          {activeBanner.link ? (
            <a
              href={activeBanner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
              onClick={(event) => {
                if (didDrag.current) event.preventDefault();
                didDrag.current = false;
              }}
            >
              <BannerImage banner={activeBanner} priority={current === 0} />
            </a>
          ) : (
            <BannerImage banner={activeBanner} priority={current === 0} />
          )}
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <motion.button
            type="button"
            className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white opacity-0 shadow-lg backdrop-blur-sm transition-colors group-hover:opacity-100 hover:bg-black/40 focus-visible:opacity-100 md:flex"
            style={{ y: "-50%" }}
            onClick={() => goTo(current - 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={subtleTap}
            aria-label="Banner anterior"
          >
            <ArrowLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            type="button"
            className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white opacity-0 shadow-lg backdrop-blur-sm transition-colors group-hover:opacity-100 hover:bg-black/40 focus-visible:opacity-100 md:flex"
            style={{ y: "-50%" }}
            onClick={() => goTo(current + 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={subtleTap}
            aria-label="Próximo banner"
          >
            <ArrowRight className="h-6 w-6" />
          </motion.button>

          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                className="relative h-3 w-8 rounded-full focus-visible:outline-white"
                onClick={() => goTo(index)}
                aria-label={`Ir para banner ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
              >
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
                {current === index && (
                  <motion.span
                    layoutId="active-home-banner-indicator"
                    className="absolute inset-y-0 left-0 right-0 m-auto h-2 rounded-full bg-white shadow-sm"
                    transition={{ duration: 0.25, ease: premiumEase }}
                  />
                )}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            Banner {current + 1} de {banners.length}: {activeBanner.name}
          </p>
        </>
      )}
    </section>
  );
}

function BannerImage({ banner, priority }: { banner: Banner; priority: boolean }) {
  return (
    <Image
      src={banner.image_url}
      alt={banner.name}
      fill
      className="object-cover object-center"
      priority={priority}
      sizes="100vw"
      quality={75}
      draggable={false}
    />
  );
}
