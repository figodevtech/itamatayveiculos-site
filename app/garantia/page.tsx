import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  BadgeCheck,
  Camera,
  CarFront,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ResponsiveReveal, Reveal } from "@/components/motion/reveal";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Garantia | Itamatay Veículos",
  description:
    "Entenda como funciona a garantia dos veículos elegíveis e fale com a equipe da Itamatay Veículos.",
};

const WARRANTY_WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5583999787149&text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20garantia%20do%20meu%20ve%C3%ADculo.";
const MAINTENANCE_WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5583999787149&text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20manuten%C3%A7%C3%A3o%20ou%20revis%C3%A3o%20do%20meu%20ve%C3%ADculo.";

const warrantyHighlights = [
  {
    title: "Veículos elegíveis",
    description:
      "A cobertura é apresentada de forma individual, conforme o veículo e as condições da venda.",
    icon: CarFront,
  },
  {
    title: "Condições transparentes",
    description:
      "Prazos, itens cobertos e orientações ficam registrados nos documentos da negociação.",
    icon: FileCheck2,
  },
  {
    title: "Atendimento orientado",
    description:
      "Nossa equipe avalia cada solicitação e informa os próximos passos do atendimento.",
    icon: BadgeCheck,
  },
];

const preparationItems = [
  {
    title: "Documento da compra",
    description: "Tenha em mãos os dados da negociação e do veículo.",
    icon: ClipboardList,
  },
  {
    title: "Quilometragem atual",
    description: "Informe a quilometragem indicada no painel.",
    icon: Gauge,
  },
  {
    title: "Fotos ou vídeos",
    description: "Se possível, registre o sintoma para facilitar a análise.",
    icon: Camera,
  },
];

export default function WarrantyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-6 lg:py-20">
            <Reveal className="max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/65">
                Segurança depois da compra
              </p>
              <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Garantia sem complicação
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
                Informação clara e uma equipe pronta para orientar você sempre
                que surgir uma dúvida sobre o seu veículo.
              </p>
            </Reveal>

            <ResponsiveReveal desktopDirection="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/20">
              <Image
                src="/images/showcase/garantia.webp"
                alt="Cliente recebendo as chaves de um veículo"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover object-[70%_center]"
              />
            </div>
            </ResponsiveReveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Entenda sua cobertura
            </p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Como funciona a garantia
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Cada veículo pode ter condições específicas. Por isso, consulte
              sempre os documentos entregues na compra e confirme as informações
              com nossa equipe.
            </p>
          </Reveal>

          <motion.div
            data-motion-reveal=""
            className="mt-10 grid gap-5 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {warrantyHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="rounded-3xl border border-border bg-card p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-mono text-xl font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
            <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Antes de solicitar atendimento
                </p>
                <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Algumas informações ajudam a agilizar a análise
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Entre em contato antes de autorizar reparos por conta própria.
                  Nossa equipe vai orientar você sobre a avaliação e os próximos
                  passos.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {preparationItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="mt-4 font-semibold text-card-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
          <Reveal className="mb-9 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Fale com nossa equipe
            </p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Como podemos ajudar?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Escolha o assunto para iniciar o atendimento com a mensagem já
              preenchida no WhatsApp.
            </p>
          </Reveal>

          <motion.div
            data-motion-reveal=""
            className="grid gap-5 lg:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.article variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground sm:p-9">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10"
              />
              <div className="relative">
                <ShieldCheck className="h-8 w-8" />
                <h3 className="mt-5 font-mono text-2xl font-bold">
                  Atendimento de garantia
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-primary-foreground/75">
                  Tire dúvidas sobre cobertura ou solicite orientação para uma
                  análise.
                </p>
                <Button
                  size="lg"
                  className="mt-7 w-full rounded-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                  asChild
                >
                  <Link
                    href={WARRANTY_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar sobre garantia
                  </Link>
                </Button>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-9">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary/5"
              />
              <div className="relative">
                <Wrench className="h-8 w-8 text-primary" />
                <h3 className="mt-5 font-mono text-2xl font-bold text-card-foreground">
                  Manutenção e revisões
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                  Converse com a equipe sobre cuidados, manutenção ou revisão do
                  seu veículo.
                </p>
                <Button
                  size="lg"
                  className="mt-7 w-full rounded-full px-7 sm:w-auto"
                  asChild
                >
                  <Link
                    href={MAINTENANCE_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar sobre manutenção
                  </Link>
                </Button>
              </div>
            </motion.article>
          </motion.div>

          <Reveal className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              Atendimento para garantia e manutenção pelo número
              <strong> (83) 99978-7149</strong>.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
