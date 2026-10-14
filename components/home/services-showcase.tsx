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
}

export function ServicesShowcase() {
  return (
    <section
      aria-labelledby="services-showcase-title"
      className="overflow-hidden bg-secondary/50 pb-12 lg:pb-16"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 id="services-showcase-title" className="sr-only">
          Serviços e Soluções Itamatay
        </h2>

        {/* Grade 2x2 no desktop e 1 coluna no mobile */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Card 1: Veículos de repasse */}
          <ShowcaseCard
            eyebrow="Oportunidades Itamatay"
            title="Veículos de repasse"
            description="Confira as opções disponíveis e encontre uma oportunidade para o seu perfil."
            image="/images/showcase/repasses-itamatay-v3.webp"
            imageAlt="Veículos disponíveis em uma concessionária"
            href="/veiculos/repasses"
            cta="Ver repasses"
            direction="left"
          />

          {/* Card 2: Seguro Auto */}
          <ShowcaseCard
            eyebrow="Proteja seu veículo"
            title="Seguro Auto"
            description="Mais tranquilidade para você e proteção para o seu veículo. Conheça nossa oferta de seguro automotivo."
            image="/images/showcase/seguro-itamatay-v3.webp"
            imageAlt="Veículo protegido com seguro automotivo"
            href="/seguro"
            cta="Conhecer o seguro"
            direction="right"
          />

          {/* Card 3: Pós-vendas */}
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

          {/* Card 4: Garantia */}
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
}: ShowcaseCardProps) {
  const minimumHeight = "min-h-[360px] sm:min-h-[400px]";

  return (
    <ResponsiveReveal desktopDirection={direction} className="h-full">
      <article className={`group relative h-full overflow-hidden rounded-2xl ${minimumHeight}`}>
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
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#102b08]/35 via-[#102b08]/10 to-transparent" />

        <Reveal
          delay={0.08}
          className={`relative flex ${minimumHeight} flex-col items-start justify-center px-6 py-10 text-white sm:px-10 max-w-lg`}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            {eyebrow}
          </p>
          <h3 className="font-mono text-3xl font-bold">{title}</h3>
          <p className="mt-3 max-w-sm leading-relaxed text-white/85">
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
