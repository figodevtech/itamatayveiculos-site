import { MessageCircle, Shield, Star } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/lib/vehicles";
import { formatPrice } from "@/lib/vehicles";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface ContactPanelProps {
  vehicle: Vehicle;
}

export function ContactPanel({ vehicle }: ContactPanelProps) {
  return (
    <motion.div
      data-motion-reveal=""
      className="flex flex-col gap-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.div variants={fadeUp}>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="font-mono text-3xl font-bold text-accent">
              {formatPrice(vehicle.price)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                ou parcelas de <span className="font-semibold text-foreground">até 60x</span>
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://api.whatsapp.com/send?phone=5583981415579&text=Olá, gostaria de saber mais sobre o veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year} versão ${vehicle.version}`}
              >
                <Button
                  variant="outline"
                  className="w-full border-accent text-accent hover:cursor-pointer hover:bg-accent/10 hover:text-accent"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensagem
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary p-3">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-xs text-muted-foreground">
                Negociação protegida pela Itamatay Veículos. Compre com segurança.
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-semibold text-card-foreground">{vehicle.seller}</p>
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
            <p className="text-xs text-muted-foreground">{vehicle.city} - {vehicle.state}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">Simule o financiamento</h3>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://api.whatsapp.com/send?phone=5583981415579&text=Olá, gostaria de simular um financiamento para o veículo ${vehicle.brand} ${vehicle.model} ${vehicle.version}.`}
            >
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Consultar Simulação
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
