import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  ArrowDown,
  CheckCircle2,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ResponsiveReveal, Reveal } from "@/components/motion/reveal";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import {
  insuranceBenefits,
  insuranceCoverages,
  itamatayDifferentials,
  insuranceSteps,
  INSURANCE_LEGAL_NOTE,
  INSURANCE_LEGAL_DISCLAIMER,
  INSURANCE_MESSAGES,
} from "@/lib/insurance-config";
import { InsuranceCtaButton } from "@/components/insurance/insurance-cta-button";
import { InsuranceMobileBar } from "@/components/insurance/insurance-mobile-bar";
import { InsuranceFaq } from "@/components/insurance/insurance-faq";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://itamatayveiculos.com.br"
  ),
  title: "Seguro Auto | Itamatay Veículos",
  description:
    "Conheça as opções de Seguro Auto apresentadas pela Itamatay Veículos. Saiba mais sobre benefícios, coberturas disponíveis e solicite informações para cotação.",
  openGraph: {
    title: "Seguro Auto | Itamatay Veículos",
    description:
      "Conheça as opções de Seguro Auto apresentadas pela Itamatay Veículos. Saiba mais sobre benefícios, coberturas disponíveis e solicite informações para cotação.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/showcase/seguro-itamatay.webp",
        width: 1200,
        height: 675,
        alt: "Seguro Auto Itamatay Veículos",
      },
    ],
  },
  alternates: {
    canonical: "/seguro",
  },
};

export default function InsurancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-16 md:pb-0">
        {/* SEÇÃO 1: HERO DE ALTO IMPACTO */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden bg-primary text-primary-foreground"
        >
          {/* Subtle geometric background accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-black/20 blur-2xl"
          />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_1fr] lg:px-6 lg:py-20">
            <Reveal className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
                <ShieldCheck className="h-4 w-4 text-[#c8f55b]" />
                <span>Proteção Automotiva</span>
              </div>

              <h1
                id="hero-heading"
                className="mt-6 font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
              >
                Seu carro protegido. Sua tranquilidade em primeiro lugar.
              </h1>

              <p className="mt-5 text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
                Imprevistos acontecem. Conte com uma solução de seguro
                automotivo pensada para ajudar você a proteger seu veículo e
                dirigir com mais tranquilidade.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <InsuranceCtaButton
                  trackingLocation="hero_primary"
                  message={INSURANCE_MESSAGES.hero}
                  variant="white"
                  className="h-12 px-7 text-sm sm:text-base"
                >
                  Solicitar cotação
                </InsuranceCtaButton>

                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 rounded-full border border-white/20 bg-white/5 text-sm font-medium text-white hover:bg-white/15 hover:text-white sm:text-base"
                  asChild
                >
                  <Link href="#beneficios" className="inline-flex items-center gap-2">
                    <span>Conhecer os benefícios</span>
                    <ArrowDown className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-primary-foreground/70">
                <CheckCircle2 className="h-4 w-4 text-[#c8f55b]" />
                <span>Atendimento humanizado e sem compromisso pelo WhatsApp</span>
              </div>
            </Reveal>

            <ResponsiveReveal desktopDirection="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/30">
                <Image
                  src="/images/showcase/seguro-hero.webp"
                  alt="Veículo executivo moderno trafegando com segurança ao amanhecer"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
                  <p className="text-xs font-semibold text-white/90">
                    Soluções sob medida para o seu automóvel
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/70">
                    Cotações personalizadas com seguradoras autorizadas.
                  </p>
                </div>
              </div>
            </ResponsiveReveal>
          </div>
        </section>

        {/* SEÇÃO 2: POR QUE CONTRATAR UM SEGURO AUTO? */}
        <section
          id="beneficios"
          aria-labelledby="benefits-title"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 lg:px-6 lg:py-24"
        >
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Por que contratar?
            </p>
            <h2
              id="benefits-title"
              className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Proteja suas conquistas e siga viagem com mais tranquilidade.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ter um seguro auto vai além de cumprir uma formalidade: é garantir
              estabilidade para o seu planejamento financeiro e amparo nas horas
              em que você mais precisa.
            </p>
          </Reveal>

          <motion.div
            data-motion-reveal=""
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {insuranceBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.article
                  key={benefit.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-mono text-lg font-bold text-card-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:flex-row sm:p-8">
            <div className="max-w-xl">
              <h3 className="font-mono text-lg font-bold text-foreground sm:text-xl">
                Quer saber o plano ideal para a sua rotina?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Converse com a equipe Itamatay e receba orientações sem
                compromisso.
              </p>
            </div>
            <InsuranceCtaButton
              trackingLocation="benefits_cta"
              message={INSURANCE_MESSAGES.benefits}
              variant="primary"
              size="default"
              className="w-full shrink-0 sm:w-auto"
            >
              Solicitar cotação personalizada
            </InsuranceCtaButton>
          </div>
        </section>

        {/* SEÇÃO 3: CONHEÇA AS COBERTURAS OFERECIDAS */}
        <section
          aria-labelledby="coverages-title"
          className="border-y border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <Reveal className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Opções de proteção
              </p>
              <h2
                id="coverages-title"
                className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Conheça as proteções disponíveis para o seu veículo.
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Cada condutor e veículo possui particularidades. Abaixo
                apresentamos exemplos de coberturas habitualmente disponíveis no
                mercado segurador que podem compor a proposta para o seu carro.
              </p>
            </Reveal>

            <motion.div
              data-motion-reveal=""
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {insuranceCoverages.map((coverage) => {
                const Icon = coverage.icon;
                return (
                  <motion.article
                    key={coverage.id}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                          {coverage.tag}
                        </span>
                      </div>
                      <h3 className="mt-5 font-mono text-lg font-bold text-card-foreground">
                        {coverage.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {coverage.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            {/* Observação jurídica obrigatória */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="leading-relaxed">
                <strong>Aviso importante:</strong> {INSURANCE_LEGAL_NOTE} Os
                exemplos acima ilustram proteções existentes no mercado e estão
                sujeitos a análise de risco e aceitação pelas seguradoras.
              </p>
            </div>

            <div className="mt-8 text-center sm:text-right">
              <InsuranceCtaButton
                trackingLocation="coverages_cta"
                message={INSURANCE_MESSAGES.coverages}
                variant="outline"
                size="default"
              >
                Consultar coberturas no WhatsApp
              </InsuranceCtaButton>
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: DIFERENCIAIS DA OFERTA ITAMATAY */}
        <section
          aria-labelledby="differentials-title"
          className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24"
        >
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Diferenciais Itamatay
            </p>
            <h2
              id="differentials-title"
              className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Por que conhecer o Seguro Auto com a Itamatay?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Aliamos a nossa vivência no mercado de seminovos ao compromisso de
              facilitar o seu acesso a orientações honestas, transparentes e
              sem enrolação.
            </p>
          </Reveal>

          <motion.div
            data-motion-reveal=""
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {itamatayDifferentials.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.id}
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-mono text-lg font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        {/* SEÇÃO 5: COMO SOLICITAR SEU SEGURO */}
        <section
          aria-labelledby="steps-title"
          className="border-y border-border bg-secondary/50 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Simples e transparente
              </p>
              <h2
                id="steps-title"
                className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Proteger seu veículo pode começar com uma conversa.
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Sem processos cansativos. Conheça as três etapas para avaliar a
                melhor proposta para o seu automóvel:
              </p>
            </Reveal>

            <motion.div
              data-motion-reveal=""
              className="mt-12 grid gap-8 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {insuranceSteps.map((step) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
                >
                  <span className="font-mono text-4xl font-extrabold text-primary/30">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-mono text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <InsuranceCtaButton
                trackingLocation="steps_cta"
                message={INSURANCE_MESSAGES.steps}
                variant="primary"
                size="lg"
                className="px-8"
              >
                Quero solicitar minha cotação
              </InsuranceCtaButton>
              <p className="mt-3 text-xs text-muted-foreground">
                Tire suas dúvidas diretamente com nossos consultores pelo WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6: CHAMADA COMERCIAL INTERMEDIÁRIA */}
        <section
          aria-labelledby="callout-heading"
          className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24"
        >
          <Reveal
            variant="scale"
            className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/25"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/showcase/seguro-callout.webp"
                alt="Detalhe automotivo premium ao cair da noite"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/75 to-neutral-950/40" />
            </div>

            <div className="relative max-w-2xl px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3.5 w-3.5 text-[#c8f55b]" />
                <span>Prevenção e segurança</span>
              </div>

              <h2
                id="callout-heading"
                className="mt-5 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                Não espere um imprevisto para pensar na proteção do seu carro.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                Conheça as opções disponíveis e descubra como um seguro pode
                fazer parte da sua tranquilidade ao dirigir.
              </p>

              <div className="mt-8">
                <InsuranceCtaButton
                  trackingLocation="callout_cta"
                  message={INSURANCE_MESSAGES.callout}
                  variant="white"
                  size="lg"
                  className="px-8"
                >
                  Falar sobre Seguro Auto
                </InsuranceCtaButton>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ) */}
        <section
          aria-labelledby="faq-title"
          className="border-t border-border bg-secondary/30 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Tire suas dúvidas
              </p>
              <h2
                id="faq-title"
                className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Perguntas frequentes
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Confira as respostas para as principais dúvidas sobre o Seguro
                Auto e seu processo de cotação.
              </p>
            </Reveal>

            <div className="mt-12">
              <InsuranceFaq />
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                Ainda tem alguma dúvida não listada aqui?
              </p>
              <div className="mt-3">
                <InsuranceCtaButton
                  trackingLocation="faq_footer"
                  message={INSURANCE_MESSAGES.faq}
                  variant="outline"
                  size="default"
                >
                  Tirar dúvidas pelo WhatsApp
                </InsuranceCtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 8: CTA FINAL */}
        <section
          aria-labelledby="final-cta-heading"
          className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24"
        >
          <Reveal
            variant="scale"
            className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 lg:px-16"
          >
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-black/15 blur-xl"
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/75">
                  Atendimento direto
                </p>
                <h2
                  id="final-cta-heading"
                  className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
                >
                  Pronto para conhecer uma proteção para o seu carro?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
                  Fale com a equipe da Itamatay e descubra as opções de seguro
                  disponíveis para o seu veículo.
                </p>
              </div>

              <div className="shrink-0">
                <InsuranceCtaButton
                  trackingLocation="final_cta"
                  message={INSURANCE_MESSAGES.final}
                  variant="white"
                  size="lg"
                  className="h-14 w-full px-8 text-base sm:w-auto"
                >
                  Solicitar cotação pelo WhatsApp
                </InsuranceCtaButton>
              </div>
            </div>

            <div className="relative mt-10 border-t border-white/15 pt-6">
              <p className="text-xs leading-relaxed text-primary-foreground/60">
                {INSURANCE_LEGAL_DISCLAIMER}
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Floating mobile quick CTA bar */}
      <InsuranceMobileBar />

      <Footer />
    </div>
  );
}
