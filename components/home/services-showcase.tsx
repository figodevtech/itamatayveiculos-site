import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { ResponsiveReveal, Reveal } from "@/components/motion/reveal";
import { premiumEase, viewportOnce } from "@/lib/motion";

interface ShowcaseCardProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
  direction: "left" | "right";
  featured?: boolean;
}

export function ServicesShowcase() {
  return (
    <section
      aria-labelledby="services-showcase-title"
      className="overflow-hidden bg-secondary/50 pb-12 lg:pb-16"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <ShowcaseCard
          eyebrow="Oportunidades Itamatay"
          title="Veículos de repasse"
          description="Confira as opções disponíveis e encontre uma oportunidade para o seu perfil."
          image="/images/showcase/repasses-itamatay-v3.webp"
          imageAlt="Veículos disponíveis em uma concessionária"
          href="/veiculos/repasses"
          cta="Ver repasses"
          direction="left"
          featured
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ShowcaseCard
            eyebrow="Cuidado contínuo"
            title="Pós-vendas"
            description="Conte com nossa equipe para cuidar do seu veículo também depois da compra."
            image="/images/showcase/pos-vendas-itamatay-v3.webp"
            imageAlt="Profissional realizando a inspeção de um veículo"
            href="/pos-venda"
            cta="Conhecer o pós-venda"
            direction="left"
          />
          <ShowcaseCard
            eyebrow="Mais tranquilidade"
            title="Garantia"
            description="Saiba como funciona a garantia oferecida para os veículos elegíveis."
            image="/images/showcase/garantia-itamatay-v3.webp"
            imageAlt="Entrega das chaves de um veículo ao cliente"
            href="/garantia"
            cta="Conhecer a garantia"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  href,
  cta,
  direction,
  featured = false,
}: ShowcaseCardProps) {
  const minimumHeight = featured
    ? "min-h-[360px] sm:min-h-[400px] lg:min-h-[430px]"
    : "min-h-[360px] sm:min-h-[400px]";

  return (
    <ResponsiveReveal desktopDirection={direction} className="h-full">
      <article className={`group relative overflow-hidden rounded-2xl ${minimumHeight}`}>
        <motion.div
          data-motion-reveal=""
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: premiumEase }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes={featured ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 1023px) 100vw, 50vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#102b08]/35 via-[#102b08]/10 to-transparent" />

        <Reveal
          delay={0.08}
          className={`relative flex ${minimumHeight} flex-col items-start justify-center px-6 py-10 text-white sm:px-10 ${featured ? "max-w-2xl lg:px-14" : "max-w-lg"}`}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            {eyebrow}
          </p>
          <Heading featured={featured}>{title}</Heading>
          <p className={`mt-3 leading-relaxed text-white/85 ${featured ? "max-w-xl text-base sm:text-lg" : "max-w-sm"}`}>
            {description}
          </p>
          <Button
            size="lg"
            className="mt-7 rounded-full bg-white px-7 text-neutral-950 hover:bg-[#c8f55b]"
            asChild
          >
            <Link href={href} className="group/link">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </article>
    </ResponsiveReveal>
  );
}

function Heading({ featured, children }: { featured: boolean; children: ReactNode }) {
  if (featured) {
    return (
      <h2 id="services-showcase-title" className="font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {children}
      </h2>
    );
  }

  return <h3 className="font-mono text-3xl font-bold">{children}</h3>;
}
