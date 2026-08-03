import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Brand {
  name: string;
  slug: string;
  logo?: string;
}

const popularBrands: Brand[] = [
  {
    name: "Toyota",
    slug: "Toyota",
    logo: "https://www.carlogos.org/car-logos/toyota-logo.png",
  },
  {
    name: "Honda",
    slug: "Honda",
    logo: "https://www.carlogos.org/car-logos/honda-logo.png",
  },
  {
    name: "Volkswagen",
    slug: "VW - VolksWagen",
    logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
  },
  {
    name: "Chevrolet",
    slug: "Chevrolet",
    logo: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
  },
  {
    name: "Hyundai",
    slug: "Hyundai",
    logo: "https://www.carlogos.org/car-logos/hyundai-logo.png",
  },
  {
    name: "Fiat",
    slug: "Fiat",
    logo: "https://www.carlogos.org/car-logos/fiat-logo.png",
  },
  {
    name: "Jeep",
    slug: "Jeep",
    logo: "https://www.carlogos.org/car-logos/jeep-logo.png",
  },
  {
    name: "Nissan",
    slug: "Nissan",
    logo: "https://www.carlogos.org/car-logos/nissan-logo.png",
  },
];

export function BrandSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <h2 className="mb-8 font-mono text-2xl font-bold text-foreground">
        Busque por marca
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {popularBrands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/veiculos?marca=${brand.slug}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-mono text-lg font-bold text-primary transition-colors group-hover:text-primary-foreground">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={100}
                  height={100}
                  className="h-full w-full object-contain"
                />
              ) : (
                brand.name.charAt(0)
              )}
            </div>
            <span className="text-center text-sm font-medium text-card-foreground">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
