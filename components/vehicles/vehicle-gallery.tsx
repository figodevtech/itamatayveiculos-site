"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VehicleGalleryProps {
  images: string[]
  alt: string
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Foto ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
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
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-card"
                  : "w-2 bg-card/50"
              }`}
              aria-label={`Ver foto ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                index === currentIndex
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
  )
}
