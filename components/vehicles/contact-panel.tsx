"use client"

import { Phone, MessageCircle, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Vehicle } from "@/lib/vehicles"
import { formatPrice } from "@/lib/vehicles"
import Link from "next/link"

interface ContactPanelProps {
  vehicle: Vehicle
}

export function ContactPanel({ vehicle }: ContactPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <p className="font-mono text-3xl font-bold text-accent">
            {formatPrice(vehicle.price)}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              ou parcelas de{" "}
              <span className="font-semibold text-foreground">
                R$ {Math.round(vehicle.price / 60).toLocaleString("pt-BR")}/mes
              </span>
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {/* <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <Phone className="mr-2 h-4 w-4" />
              Ver telefone
            </Button> */}
            {vehicle.message ? (

              <Link
                target="_blank"
                href={`https://wa.me/send/?phone=5583982209260&text=${vehicle.message}`}
              >
                <Button
                  variant="outline"
                  className="hover:text-accent hover:cursor-pointer w-full border-accent text-accent hover:bg-accent/10"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensagem
                </Button>
              </Link>
            ) :
              (<Link
                target="_blank"
                href={`https://wa.me/send/?phone=5583982209260`}
              >
                <Button
                  variant="outline"
                  className="hover:text-accent hover:cursor-pointer w-full border-accent text-accent hover:bg-accent/10"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensagem
                </Button>
              </Link>)}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary p-3">
            <Shield className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-xs text-muted-foreground">
              Negociacao protegida pelo Alan Car. Compre com seguranca.
            </span>
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
            <div>
              <Label className="text-xs text-muted-foreground">Entrada</Label>
              <Input
                placeholder="R$ 0,00"
                className="bg-secondary text-secondary-foreground"
                defaultValue={`R$ ${Math.round(vehicle.price * 0.2).toLocaleString("pt-BR")}`}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Parcelas</Label>
              <Input
                placeholder="48x"
                className="bg-secondary text-secondary-foreground"
                defaultValue="48x"
              />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Simular
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold text-card-foreground">
            Envie uma proposta
          </h3>
          <form className="flex flex-col gap-3">
            <Input
              placeholder="Seu nome"
              className="bg-secondary text-secondary-foreground"
            />
            <Input
              placeholder="Seu e-mail"
              type="email"
              className="bg-secondary text-secondary-foreground"
            />
            <Input
              placeholder="Seu telefone"
              type="tel"
              className="bg-secondary text-secondary-foreground"
            />
            <Textarea
              placeholder="Escreva sua mensagem..."
              className="bg-secondary text-secondary-foreground"
              rows={3}
              defaultValue={`Ola, tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version}.`}
            />
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Enviar proposta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
