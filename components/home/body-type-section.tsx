import Link from "next/link"
import { Car, Truck, Boxes } from "lucide-react"

const bodyTypes = [
  {
    name: "Sedans",
    slug: "Sedan",
    icon: Car,
    description: "Conforto e elegancia para o dia a dia",
    count: 0,
  },
  {
    name: "SUVs",
    slug: "SUV",
    icon: Boxes,
    description: "Versatilidade e espaco para a familia",
    count: 4,
  },
  {
    name: "Hatchbacks",
    slug: "Hatch",
    icon: Car,
    description: "Compactos e economicos para a cidade",
    count: 1,
  },
  {
    name: "Picapes",
    slug: "Picape",
    icon: Truck,
    description: "Forca e capacidade para trabalho e lazer",
    count: 0,
  },
]

export function BodyTypeSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
      <h2 className="mb-8 font-mono text-2xl font-bold text-foreground">
        Busque por tipo
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bodyTypes.map((type) => {
          const Icon = type.icon
          return (
            <Link
              key={type.slug}
              href={`/veiculos?tipo=${type.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  {type.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {type.description}
                </p>
                <p className="mt-2 text-xs font-semibold text-primary">
                  {type.count.toLocaleString("pt-BR")} ofertas
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
