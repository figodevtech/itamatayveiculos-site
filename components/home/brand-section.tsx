import Link from "next/link"

const popularBrands = [
  { name: "Toyota", slug: "Toyota" },
  { name: "Honda", slug: "Honda" },
  { name: "Volkswagen", slug: "Volkswagen" },
  { name: "Chevrolet", slug: "Chevrolet" },
  { name: "Hyundai", slug: "Hyundai" },
  { name: "Fiat", slug: "Fiat" },
  { name: "Jeep", slug: "Jeep" },
  { name: "Nissan", slug: "Nissan" },
]

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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              {brand.name.charAt(0)}
            </div>
            <span className="text-center text-sm font-medium text-card-foreground">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
