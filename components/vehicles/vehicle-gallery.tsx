"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { premiumEase, subtleTap } from "@/lib/motion";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

const imageVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
  }),
};

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const galleryId = useId();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const displayedIndex = currentIndex < images.length ? currentIndex : 0;

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((loaded) => {
      if (loaded.has(src)) return loaded;
      const next = new Set(loaded);
      next.add(src);
      return next;
    });
  }, []);

  const goTo = useCallback(
    (index: number, forcedDirection?: number) => {
      if (images.length === 0) return;
      const nextIndex = (index + images.length) % images.length;
      if (nextIndex === displayedIndex) return;

      setDirection(forcedDirection ?? (nextIndex > displayedIndex ? 1 : -1));
      setCurrentIndex(nextIndex);
    },
    [displayedIndex, images.length],
  );

  const goPrev = useCallback(() => goTo(displayedIndex - 1, -1), [displayedIndex, goTo]);
  const goNext = useCallback(() => goTo(displayedIndex + 1, 1), [displayedIndex, goTo]);

  useEffect(() => {
    const currentThumbnail = thumbnailsRef.current?.children[displayedIndex] as HTMLElement | undefined;
    currentThumbnail?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [displayedIndex, shouldReduceMotion]);

  useEffect(() => {
    if (images.length <= 1) return;

    let cancelled = false;
    const neighbors = [
      images[(displayedIndex - 1 + images.length) % images.length],
      images[(displayedIndex + 1) % images.length],
    ];
    const preloaders = neighbors.map((src) => {
      const preloader = new window.Image();
      preloader.onload = () => {
        if (!cancelled) markLoaded(src);
      };
      preloader.src = src;
      return preloader;
    });

    return () => {
      cancelled = true;
      preloaders.forEach((preloader) => {
        preloader.onload = null;
      });
    };
  }, [displayedIndex, images, markLoaded]);

  if (images.length === 0) {
    return <div className="aspect-16/10 rounded-xl bg-muted" aria-label="Galeria sem imagens" />;
  }

  const activeImage = images[displayedIndex];
  const activeImageIsLoaded = loadedImages.has(activeImage);
  const variants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : imageVariants;

  return (
    <LayoutGroup id={galleryId}>
      <div>
        <div
          className="group relative aspect-16/10 overflow-hidden rounded-xl bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          role="group"
          aria-label="Galeria de fotos do veículo"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goPrev();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              goNext();
            }
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${displayedIndex}-${activeImage}`}
              className="absolute inset-0"
              custom={direction}
              variants={variants}
              initial={activeImageIsLoaded ? "enter" : false}
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: premiumEase }}
            >
              <NextImage
                src={activeImage}
                alt={`${alt} - Foto ${displayedIndex + 1}`}
                fill
                className="object-cover"
                priority={displayedIndex === 0}
                sizes="(max-width: 768px) 100vw, 864px"
                quality={75}
                onLoad={() => markLoaded(activeImage)}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <motion.button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white opacity-100 shadow-lg backdrop-blur-md transition-[background-color,opacity] hover:bg-black/40 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                style={{ y: "-50%" }}
                whileTap={subtleTap}
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white opacity-100 shadow-lg backdrop-blur-md transition-[background-color,opacity] hover:bg-black/40 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                style={{ y: "-50%" }}
                whileTap={subtleTap}
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}-indicator`}
                type="button"
                onClick={() => goTo(index)}
                className="relative h-3 w-7 rounded-full focus-visible:outline-white"
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === displayedIndex ? "true" : undefined}
              >
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card/50" />
                {index === displayedIndex && (
                  <motion.span
                    layoutId="active-gallery-indicator"
                    className="absolute inset-x-0 inset-y-0 my-auto h-2 rounded-full bg-card"
                    transition={{ duration: 0.2, ease: premiumEase }}
                  />
                )}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            Foto {displayedIndex + 1} de {images.length}
          </p>
        </div>

        {images.length > 1 && (
          <div className="max-w-[864px] overflow-x-auto overflow-y-hidden pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/70">
            <div ref={thumbnailsRef} className="mt-3 flex gap-2 px-4 py-2">
              {images.map((image, index) => {
                const isActive = index === displayedIndex;

                return (
                  <motion.button
                    key={`${image}-${index}-thumbnail`}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={subtleTap}
                    aria-label={`Selecionar foto ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <NextImage
                      src={image}
                      alt={`${alt} - Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                      onLoad={() => markLoaded(image)}
                    />
                    {isActive && (
                      <motion.span
                        layoutId="active-vehicle-thumbnail"
                        className="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary"
                        transition={{ duration: 0.22, ease: premiumEase }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}
