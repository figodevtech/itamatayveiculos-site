"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Car, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { brands } from "@/lib/vehicles"

export function HeroSearch() {
  const router = useRouter()
  const [brand, setBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [yearRange, setYearRange] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (brand) params.set("marca", brand)
    if (priceRange) params.set("preco", priceRange)
    if (yearRange) params.set("ano", yearRange)
    router.push(`/veiculos?${params.toString()}`)
  }

  return (
    <section className="relative mt-5 z-10 mx-auto max-w-6xl px-4 lg:px-6">
      <div className="rounded-2xl bg-card p-5 shadow-xl ring-1 ring-border/50 md:p-6">
        <h2 className="mb-4 font-mono text-lg font-bold text-card-foreground">
          Encontre seu próximo veículo
        </h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Car className="h-3.5 w-3.5" />
              Marca
            </label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground">
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Faixa de preco
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground">
                <SelectValue placeholder="Qualquer preco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-80000">Ate R$ 80.000</SelectItem>
                <SelectItem value="80000-120000">R$ 80.000 - R$ 120.000</SelectItem>
                <SelectItem value="120000-200000">R$ 120.000 - R$ 200.000</SelectItem>
                <SelectItem value="200000-999999">Acima de R$ 200.000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Ano
            </label>
            <Select value={yearRange} onValueChange={setYearRange}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground">
                <SelectValue placeholder="Qualquer ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            className="bg-accent text-accent-foreground hover:bg-accent/90 md:px-8"
            size="lg"
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        <div className=" mt-5 flex flex-wrap items-center gap-6 border-t border-border pt-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-card-foreground">
              100+
            </span>
            <span className="text-sm">veiculos</span>
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-card-foreground">
              10+
            </span>
            <span className="text-sm">lojas</span>
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-card-foreground">
              7
            </span>
            <span className="text-sm">estados</span>
          </div>
        </div>
      </div>
    </section>
  )
}
