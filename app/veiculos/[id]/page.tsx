import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  ChevronRight,
  Heart,
  Share2,
  Check,
  Star,
  Shield,
  MapPin,
  Play,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { ContactPanel } from "@/components/vehicles/contact-panel";
import { VehicleCard } from "@/components/vehicle-card";
import {
  getVehicleById,
  getVehicles,
  formatPrice,
  formatMileage,
} from "@/lib/vehicles";
import { getShortByVehicleId } from "@/services/shorts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AIDescriptionBox } from "@/components/vehicles/ai-description";
import { getAppSettings } from "@/services/settings";
import { Reveal } from "@/components/motion/reveal";
import { fadeIn, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export const revalidate = 0;

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

const SITE_NAME = "Itamatay Veiculos";
const DEFAULT_SITE_URL = "https://itamatayveiculos.com.br";
const DEFAULT_OG_IMAGE = "/images/logos/itamatay-logo.png";

function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!configuredUrl) {
    return new URL(DEFAULT_SITE_URL);
  }

  return new URL(
    configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`,
  );
}

function getAbsoluteUrl(url: string, baseUrl: URL) {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return new URL(DEFAULT_OG_IMAGE, baseUrl).toString();
  }
}

function truncateDescription(description: string, maxLength = 180) {
  const normalized = description.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) return { title: "Veiculo nao encontrado" };

  const siteUrl = getSiteUrl();
  const vehicleUrl = new URL(`/veiculos/${vehicle.id}`, siteUrl).toString();
  const imageUrl = getAbsoluteUrl(vehicle.image || DEFAULT_OG_IMAGE, siteUrl);
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}/${vehicle.yearModel} - ${SITE_NAME}`;
  const description = truncateDescription(
    vehicle.description ||
      `${vehicle.brand} ${vehicle.model} ${vehicle.version} disponivel na ${SITE_NAME}.`,
  );

  return {
    title,
    description,
    alternates: {
      canonical: vehicleUrl,
    },
    openGraph: {
      title,
      description,
      url: vehicleUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "pt_BR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "product:price:amount": String(vehicle.price),
      "product:price:currency": "BRL",
      "product:availability":
        vehicle.status === "Vendido" ? "out of stock" : "in stock",
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const [shortVideo, allVehicles, settings] = await Promise.all([
    getShortByVehicleId(id),
    getVehicles(),
    getAppSettings(),
  ]);

  const relatedVehicles = allVehicles
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
          <motion.nav
            data-motion-reveal=""
            className="flex items-center gap-1 text-xs text-muted-foreground"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <Link href="/" className="hover:text-foreground">
              Início
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/veiculos" className="hover:text-foreground">
              Veículos
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
          </motion.nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
          {/* Title area */}
          <motion.div
            data-motion-reveal=""
            className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div data-motion-reveal="" variants={staggerContainer}>
              <motion.div data-motion-reveal="" variants={fadeIn} className="mb-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {vehicle.sellerType === "dealership"
                    ? "Concessionária"
                    : vehicle.sellerType === "store"
                      ? "Loja"
                      : "Particular"}
                </Badge>
                {vehicle.isNew && (
                  <Badge className="bg-accent text-accent-foreground">
                    Novo
                  </Badge>
                )}
              </motion.div>
              <motion.h1 data-motion-reveal="" variants={fadeUp} className="font-mono text-2xl font-bold text-foreground md:text-3xl">
                {vehicle.brand} {vehicle.model}
              </motion.h1>
              <motion.p data-motion-reveal="" variants={fadeUp} className="mt-1 text-base text-muted-foreground">
                {vehicle.version}
              </motion.p>
              <motion.div data-motion-reveal="" variants={fadeUp} className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {vehicle.year}/{vehicle.yearModel}
                </span>
                {vehicle.mileage && (
                  <span>{formatMileage(vehicle.mileage)}</span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {vehicle.city} -{" "}
                  {vehicle.state}
                </span>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex w-full items-center gap-2 md:w-auto">
              <Button variant="outline" size="icon" aria-label="Favoritar veículo">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favoritar</span>
              </Button>
              <Button variant="outline" size="icon" aria-label="Compartilhar veículo">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Compartilhar</span>
              </Button>

              {shortVideo && (
                <motion.div variants={fadeIn} className="ml-auto">
                  <Link
                    href={`/shorts?v=${shortVideo.id}`}
                    className="block outline-none appearance-none"
                  >
                    <Button
                      className="bg-linear-to-r from-rose-500 via-red-500 to-orange-500 hover:shadow-md shadow-red-500/20 text-white font-bold group relative overflow-hidden transition-all transform-gpu active:scale-95 border-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(to right, #f43f5e, #ef4444, #f97316)",
                      }}
                    >
                      <Play className="w-4 h-4 mr-2 fill-white group-hover:scale-110 transition-transform" />
                      <span className="tracking-wide">Assistir Shorts</span>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] xl:group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Main content */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <Reveal variant="scale">
                <VehicleGallery
                  images={vehicle.images.map((img) => img.image_url)}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                />
              </Reveal>

              <div className="mt-6 flex flex-col gap-6">
                {/* Price mobile */}
                <Reveal className="flex flex-col gap-4 lg:hidden">
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
                        <Link
                          target="_blank"
                          href={`https://api.whatsapp.com/send?phone=5583981415579&text=Olá, gostaria de saber mais sobre o veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year} versão ${vehicle.version}`}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-accent text-accent hover:bg-accent/10"
                          >
                            Enviar mensagem
                          </Button>
                        </Link>
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary p-3">
                          <Shield className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            Negociação protegida pela Itamatay Veículos. Compre
                            com segurança.
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
                            {vehicle.sellerType === "dealership"
                              ? "Concessionária"
                              : vehicle.sellerType === "store"
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
                </Reveal>

                <VehicleSpecs vehicle={vehicle} />

                {/* Description */}
                <Reveal>
                <Card className="border-border bg-card">
                  <CardContent className="p-5">
                    <h3 className="mb-3 font-mono text-lg font-bold text-card-foreground">
                      Descrição do anúncio
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>
                </Reveal>
                {vehicle.enableAiDescription && (
                  <Reveal>
                    <AIDescriptionBox text={vehicle.aiDescription || undefined} />
                  </Reveal>
                )}

                {/* Features */}
                <Reveal>
                <Card className="border-border bg-card">
                  <CardContent className="p-5">
                    <h3 className="mb-4 font-mono text-lg font-bold text-card-foreground">
                      Itens do veículo
                    </h3>
                    <motion.div
                      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportOnce}
                    >
                      {vehicle.features.map((feature) => (
                        <motion.div
                          key={feature}
                          variants={fadeUp}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
                </Reveal>
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
            <motion.section
              data-motion-reveal=""
              className="mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.h2 variants={fadeUp} className="mb-6 font-mono text-xl font-bold text-foreground">
                Veículos similares
              </motion.h2>
              <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedVehicles.map((v) => (
                  <motion.div key={v.id} variants={fadeUp} className="h-full">
                    <VehicleCard
                      vehicle={v}
                      primaryColor={settings?.primary_color}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
