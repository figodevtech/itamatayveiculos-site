"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { brands, bodyTypes, fuelTypes } from "@/lib/vehicles"

interface FilterSidebarProps {
  filters: {
    brand: string
    bodyType: string
    fuelType: string
    priceRange: [number, number]
    yearMin: string
    yearMax: string
    sortBy: string
  }
  onFilterChange: (key: string, value: unknown) => void
  onClearFilters: () => void
  onClose?: () => void
  resultCount: number
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  onClose,
  resultCount,
}: FilterSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-foreground">
          Filtros
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-accent hover:underline"
          >
            Limpar filtros
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 lg:hidden"
              aria-label="Fechar filtros"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Marca
        </Label>
        <Select
          value={filters.brand}
          onValueChange={(v) => onFilterChange("brand", v)}
        >
          <SelectTrigger className="bg-card text-card-foreground">
            <SelectValue placeholder="Todas as marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as marcas</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tipo de carroceria
        </Label>
        <div className="flex flex-col gap-2">
          {bodyTypes.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                checked={filters.bodyType === type}
                onCheckedChange={(checked) =>
                  onFilterChange("bodyType", checked ? type : "")
                }
              />
              <span className="text-sm text-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Combustivel
        </Label>
        <div className="flex flex-col gap-2">
          {fuelTypes.map((fuel) => (
            <label
              key={fuel}
              className="flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                checked={filters.fuelType === fuel}
                onCheckedChange={(checked) =>
                  onFilterChange("fuelType", checked ? fuel : "")
                }
              />
              <span className="text-sm text-foreground">{fuel}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Faixa de preco
        </Label>
        <Slider
          value={filters.priceRange}
          min={0}
          max={400000}
          step={10000}
          onValueChange={(v) => onFilterChange("priceRange", v)}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            R$ {filters.priceRange[0].toLocaleString("pt-BR")}
          </span>
          <span>
            R$ {filters.priceRange[1].toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ano
        </Label>
        <div className="flex items-center gap-2">
          <Select
            value={filters.yearMin}
            onValueChange={(v) => onFilterChange("yearMin", v)}
          >
            <SelectTrigger className="bg-card text-card-foreground">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Qualquer</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">ate</span>
          <Select
            value={filters.yearMax}
            onValueChange={(v) => onFilterChange("yearMax", v)}
          >
            <SelectTrigger className="bg-card text-card-foreground">
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Qualquer</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onClose}
        className="bg-accent text-accent-foreground hover:bg-accent/90 lg:hidden"
      >
        Ver {resultCount} resultados
      </Button>
    </aside>
  )
}
