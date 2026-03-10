import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Heart, Share2, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery"
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs"
import { ContactPanel } from "@/components/vehicles/contact-panel"
import { VehicleCard } from "@/components/vehicle-card"
import { getVehicleById, vehicles, formatPrice, formatMileage } from "@/lib/vehicles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { id } = await params
  const vehicle = getVehicleById(id)
  if (!vehicle) return { title: "Veiculo nao encontrado" }
  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.version} - AlanCar`,
    description: vehicle.description,
  }
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params
  const vehicle = getVehicleById(id)

  if (!vehicle) {
    notFound()
  }

  const relatedVehicles = vehicles
    .filter((v) => v.id !== vehicle.id && (v.brand === vehicle.brand || v.bodyType === vehicle.bodyType))
    .slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/veiculos" className="hover:text-foreground">
              Veiculos
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/veiculos?marca=${vehicle.brand}`}
              className="hover:text-foreground"
            >
              {vehicle.brand}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">
              {vehicle.model}
            </span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
          {/* Title area */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {vehicle.sellerType === "concessionaria"
                    ? "Concessionaria"
                    : vehicle.sellerType === "loja"
                      ? "Loja"
                      : "Particular"}
                </Badge>
                {vehicle.isNew && (
                  <Badge className="bg-accent text-accent-foreground">
                    Novo
                  </Badge>
                )}
              </div>
              <h1 className="font-mono text-2xl font-bold text-foreground md:text-3xl">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                {vehicle.version}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {vehicle.year}/{vehicle.yearModel}
                </span>
                {vehicle.mileage && (
                  <span>{formatMileage(vehicle.mileage)}</span>
                )}
                <span>
                  {vehicle.city} - {vehicle.state}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favoritar</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Compartilhar</span>
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <VehicleGallery
                images={vehicle.images}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />

              <div className="mt-6 flex flex-col gap-6">
                {/* Price mobile */}
                <div className="lg:hidden">
                  <Card className="border-border bg-card">
                    <CardContent className="p-5">
                      <p className="font-mono text-3xl font-bold text-accent">
                        {formatPrice(vehicle.price)}
                      </p>
                      <div className="mt-4 flex flex-col gap-2">
                        {/* <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                          Ver telefone
                        </Button> */}
                        {vehicle.message && (
                          <Link
                            target="_blank"
                            href={`https://wa.me/send/?phone=5583982209260&text=${vehicle.message}`}>
                            <Button
                              variant="outline"
                              className="w-full border-accent text-accent hover:bg-accent/10"
                            >
                              Enviar mensagem
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <VehicleSpecs vehicle={vehicle} />

                {/* Description */}
                <Card className="border-border bg-card">
                  <CardContent className="p-5">
                    <h3 className="mb-3 font-mono text-lg font-bold text-card-foreground">
                      Descricao do anuncio
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="border-border bg-card">
                  <CardContent className="p-5">
                    <h3 className="mb-4 font-mono text-lg font-bold text-card-foreground">
                      Itens do veiculo
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {vehicle.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact panel desktop */}
            <div className="hidden w-80 shrink-0 lg:block">
              <div className="sticky top-20">
                <ContactPanel vehicle={vehicle} />
              </div>
            </div>
          </div>

          {/* Related vehicles */}
          {relatedVehicles.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 font-mono text-xl font-bold text-foreground">
                Veiculos similares
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
