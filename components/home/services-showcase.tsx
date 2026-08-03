import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesShowcase() {
  return (
    <section
      aria-labelledby="services-showcase-title"
      className="bg-secondary/50 pb-12 lg:pb-16"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <article className="group relative min-h-[360px] overflow-hidden rounded-2xl sm:min-h-[400px] lg:min-h-[430px]">
          <Image
            src="/images/showcase/repasses.webp"
            alt="Veículos disponíveis em uma concessionária"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06172d]/95 via-[#06172d]/75 to-[#06172d]/10" />

          <div className="relative flex min-h-[360px] max-w-2xl flex-col items-start justify-center px-6 py-10 text-white sm:min-h-[400px] sm:px-10 lg:min-h-[430px] lg:px-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Oportunidades Itamatay
            </p>
            <h2
              id="services-showcase-title"
              className="font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Veículos de repasse
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Confira as opções disponíveis e encontre uma oportunidade para o
              seu perfil.
            </p>
            <Button
              size="lg"
              className="mt-7 rounded-full bg-white px-7 text-[#06172d] hover:bg-white/90"
              asChild
            >
              <Link href="/veiculos/repasses">
                Ver repasses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="group relative min-h-[360px] overflow-hidden rounded-2xl sm:min-h-[400px]">
            <Image
              src="/images/showcase/pos-vendas.webp"
              alt="Profissional realizando a inspeção de um veículo"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06172d]/95 via-[#06172d]/70 to-[#06172d]/10" />

            <div className="relative flex min-h-[360px] max-w-lg flex-col items-start justify-center px-6 py-10 text-white sm:min-h-[400px] sm:px-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Cuidado contínuo
              </p>
              <h3 className="font-mono text-3xl font-bold">Pós-vendas</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-white/85">
                Conte com nossa equipe para cuidar do seu veículo também depois
                da compra.
              </p>
              <Button
                size="lg"
                className="mt-7 rounded-full bg-white px-7 text-[#06172d] hover:bg-white/90"
                asChild
              >
                <Link
                  href="/pos-venda"
                >
                  Conhecer o pós-venda
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>

          <article className="group relative min-h-[360px] overflow-hidden rounded-2xl sm:min-h-[400px]">
            <Image
              src="/images/showcase/garantia.webp"
              alt="Entrega das chaves de um veículo ao cliente"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06172d]/95 via-[#06172d]/70 to-[#06172d]/10" />

            <div className="relative flex min-h-[360px] max-w-lg flex-col items-start justify-center px-6 py-10 text-white sm:min-h-[400px] sm:px-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Mais tranquilidade
              </p>
              <h3 className="font-mono text-3xl font-bold">Garantia</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-white/85">
                Saiba como funciona a garantia oferecida para os veículos
                elegíveis.
              </p>
              <Button
                size="lg"
                className="mt-7 rounded-full bg-white px-7 text-[#06172d] hover:bg-white/90"
                asChild
              >
                <Link
                  href="/garantia"
                >
                  Conhecer a garantia
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
