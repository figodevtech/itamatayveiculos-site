import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Headphones,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pós-venda | Itamatay Veículos",
  description:
    "Conheça o suporte pós-venda da Itamatay Veículos e fale com nossa equipe.",
};

const services = [
  {
    title: "Revisões",
    description:
      "Orientações para manter seu veículo sempre em boas condições.",
    icon: Wrench,
  },
  {
    title: "Documentação do veículo",
    description:
      "Auxílio com documentos, transferências e outras etapas da regularização.",
    icon: FileText,
  },
  {
    title: "Garantia e suporte",
    description:
      "Informações claras sobre a garantia dos veículos elegíveis.",
    icon: ShieldCheck,
  },
  {
    title: "Atendimento personalizado",
    description:
      "Uma equipe preparada para entender sua necessidade e orientar você.",
    icon: Headphones,
  },
  {
    title: "Acompanhamento do veículo",
    description:
      "Apoio para acompanhar cada etapa e cuidar melhor do seu automóvel.",
    icon: CarFront,
  },
  {
    title: "Suporte após a compra",
    description:
      "Conte com a gente sempre que precisar esclarecer alguma dúvida.",
    icon: MessagesSquare,
  },
];

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5583987620191&text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20meu%20ve%C3%ADculo%20no%20p%C3%B3s-venda.";

export default function AfterSalesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="overflow-hidden border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-6 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Cuidado que continua
              </p>
              <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Pós-venda
              </h1>
              <p className="mt-5 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                Nosso compromisso continua depois da sua compra.
              </p>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                Conte com suporte, orientação e praticidade para cuidar do seu
                veículo com mais tranquilidade em cada etapa.
              </p>

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-foreground">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span>Atendimento próximo, claro e focado no que você precisa.</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-primary/10 shadow-xl shadow-primary/10">
              <Image
                src="/images/showcase/pos-vendas.webp"
                alt="Profissional realizando a inspeção de um veículo"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover object-[72%_center]"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Suporte completo
            </p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              O que você encontra no nosso pós-venda
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Uma estrutura de atendimento pensada para oferecer orientação e
              confiança também depois que você sai de carro novo.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-mono text-lg font-bold text-card-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-6 lg:py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 lg:h-28 lg:w-28">
              <ClipboardCheck className="h-9 w-9 lg:h-12 lg:w-12" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Conte com a gente
              </p>
              <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comprou seu veículo? Continuamos ao seu lado.
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                Nosso pós-venda foi criado para oferecer mais tranquilidade,
                segurança e apoio depois da compra. Se surgir alguma dúvida ou
                necessidade, nossa equipe está pronta para orientar você.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-9 text-primary-foreground shadow-xl shadow-primary/15 sm:px-10 lg:px-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-black/10"
            />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:flex">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/65">
                    Atendimento pelo WhatsApp
                  </p>
                  <h2 className="mt-2 font-mono text-2xl font-bold sm:text-3xl">
                    Precisa de ajuda com seu veículo?
                  </h2>
                  <p className="mt-2 text-primary-foreground/75">
                    Fale diretamente com nossa equipe de pós-venda.
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="h-12 w-full rounded-full bg-white px-7 text-primary hover:bg-white/90 sm:w-auto"
                asChild
              >
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Entrar em contato
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
