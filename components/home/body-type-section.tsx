import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Boxes, Car, Truck } from "lucide-react";
import { getBodyTypeCounts } from "@/services/vehicles";

const bodyTypesData = [
  { name: "Sedans", slug: "Sedan", icon: Car, description: "Conforto e elegância para o dia a dia" },
  { name: "SUVs", slug: "SUV", icon: Boxes, description: "Versatilidade e espaço para a família" },
  { name: "Hatchbacks", slug: "Hatch", icon: Car, description: "Compactos e econômicos para a cidade" },
  { name: "Picapes", slug: "Picape", icon: Truck, description: "Força e capacidade para trabalho e lazer" },
];

export async function BodyTypeSection() {
  await connection();
  const counts = await getBodyTypeCounts().catch(error => {
    console.error("Home category counts unavailable", error);
    return null;
  });

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16"
    >
      <h2 className="mb-8 font-mono text-2xl font-bold text-foreground">
        Busque por tipo
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bodyTypesData.map((type) => {
          const Icon = type.icon;
          const count = counts?.[type.slug] ?? 0;

          return (
            <div
              key={type.slug}
              className="h-full"
            >
              <Link
                href={`/veiculos?tipo=${type.slug}`}
                className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-card-foreground">{type.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{type.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                    {counts ? `${count.toLocaleString("pt-BR")} ofertas` : "Ver ofertas"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
