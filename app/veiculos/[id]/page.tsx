import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Heart, Share2, Check, Star, Shield } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { ContactPanel } from "@/components/vehicles/contact-panel";
import { VehicleCard } from "@/components/vehicle-card";
import {
  getVehicleById,
  vehicles,
  formatPrice,
  formatMileage,
} from "@/lib/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AIDescriptionBox } from "@/components/vehicles/ai-description";

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) return { title: "Veiculo nao encontrado" };
  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.version} - Itamatay Veículos`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = vehicles
    .filter(
      (v) =>
        v.id !== vehicle.id &&
        (v.brand === vehicle.brand || v.bodyType === vehicle.bodyType),
    )
    .slice(0, 3);

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
            <span className="text-foreground">{vehicle.model}</span>
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
                <div className="flex flex-col gap-4 lg:hidden">
                  <Card className="border-border bg-card">
                    <CardContent className="p-5">
                      <p className="font-mono text-3xl font-bold text-accent">
                        {formatPrice(vehicle.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          ou parcelas de{" "}
                          {/* <span className="font-semibold text-foreground">
                            R${" "}
                            {Math.round(vehicle.price / 60).toLocaleString(
                              "pt-BR",
                            )}
                            /mes
                          </span> */}
                          <span className="font-semibold text-foreground">
                            até 60x
                          </span>
                        </span>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        {/* <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                          Ver telefone
                        </Button> */}
                        {vehicle.message && (
                          <Link
                            target="_blank"
                            href={`https://api.whatsapp.com/send?phone=5583981415579&text=${vehicle.message}`}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-accent text-accent hover:bg-accent/10"
                            >
                              Enviar mensagem
                            </Button>
                          </Link>
                        )}
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary p-3">
                          <Shield className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            Negociacao protegida pela Itamatay Veículos. Compre
                            com seguranca.
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-card-foreground">
                            {vehicle.seller}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.sellerType === "concessionaria"
                              ? "Concessionaria"
                              : vehicle.sellerType === "loja"
                                ? "Loja"
                                : "Particular"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-accent">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {vehicle.city} - {vehicle.state}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card">
                    <CardContent className="p-5">
                      <h3 className="mb-4 font-semibold text-card-foreground">
                        Simule o financiamento
                      </h3>
                      <div className="flex flex-col gap-3">
                        {/* <div>
                          <Label className="text-xs text-muted-foreground">
                            Entrada
                          </Label>
                          <Input
                            placeholder="R$ 0,00"
                            className="bg-secondary text-secondary-foreground"
                            defaultValue={`R$ ${Math.round(vehicle.price * 0.2).toLocaleString("pt-BR")}`}
                          />
                        </div> */}
                        {/* <div>
                          <Label className="text-xs text-muted-foreground">
                            Parcelas
                          </Label>
                          <Input
                            placeholder="48x"
                            className="bg-secondary text-secondary-foreground"
                          />
                        </div> */}
                        <Link
                          target="_blank"
                          href={`https://api.whatsapp.com/send?phone=5583981415579&text=Olá, gostaria de simular um financiamento para o veículo ${vehicle.brand} ${vehicle.model} ${vehicle.version}.`}
                        >
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Consultar Simulação
                          </Button>
                        </Link>
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
                {vehicle.enableAiDescription && (
                  <AIDescriptionBox text={vehicle.aiDescription} />
                )}

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
  );
}
