"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VehicleGalleryProps {
  images: string[]
  alt: string
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!thumbnailsRef.current) return
    const currentThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement
    if (currentThumbnail) {
      currentThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [currentIndex])

  function goTo(index: number) {
    setCurrentIndex(index)
  }

  function goPrev() {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  function goNext() {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div>

      <div className="group relative aspect-16/10 overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Foto ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 864px"
          quality={85}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-card-foreground opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-card-foreground opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100"
              aria-label="Proxima foto"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                ? "w-6 bg-card"
                : "w-2 bg-card/50"
                }`}
              aria-label={`Ver foto ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="max-w-[864px] overflow-x-auto overflow-y-hidden pb-2 scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/70">

        {images.length > 1 && (
          <div ref={thumbnailsRef} className="px-4 py-2 mt-3 flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${index === currentIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
                  }`}
              >
                <Image
                  src={img}
                  alt={`${alt} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}