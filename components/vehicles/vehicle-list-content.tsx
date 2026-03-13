"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard } from "@/components/vehicle-card";
import { FilterSidebar } from "@/components/vehicles/filter-sidebar";
import type { Vehicle } from "@/lib/vehicles";

interface VehicleListContentProps {
  initialVehicles: Vehicle[];
}

export function VehicleListContent({
  initialVehicles,
}: VehicleListContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filters = {
    brand: searchParams.get("marca") || "all",
    bodyType: searchParams.get("tipo") || "",
    fuelType: searchParams.get("combustivel") || "",
    priceRange: [
      Number(searchParams.get("precoMin")) || 0,
      Number(searchParams.get("precoMax")) || 400000,
    ] as [number, number],
    yearMin: searchParams.get("anoMin") || "any",
    yearMax: searchParams.get("anoMax") || "any",
    sortBy: searchParams.get("sortBy") || "relevance",
  };

  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const params = new URLSearchParams(searchParams.toString());

      let newValue = value as string;
      if (key === "priceRange") {
        const range = value as [number, number];
        params.set("precoMin", range[0].toString());
        params.set("precoMax", range[1].toString());
      } else {
        const urlKey =
          key === "brand"
            ? "marca"
            : key === "bodyType"
              ? "tipo"
              : key === "fuelType"
                ? "combustivel"
                : key === "yearMin"
                  ? "anoMin"
                  : key === "yearMax"
                    ? "anoMax"
                    : key;

        if (value && value !== "all" && value !== "any") {
          params.set(urlKey, newValue);
        } else {
          params.delete(urlKey);
        }
      }

      router.push(`/veiculos?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleClearFilters = useCallback(() => {
    router.push("/veiculos", { scroll: false });
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="mb-6">
        <h1 className="font-mono text-2xl font-bold text-foreground md:text-3xl">
          Veiculos a venda
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {initialVehicles.length} veiculos encontrados
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </Button>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-lg border border-border p-0.5 md:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Visualizar em grade"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Visualizar em lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Select
            value={filters.sortBy}
            onValueChange={(v) => handleFilterChange("sortBy", v)}
          >
            <SelectTrigger className="w-44 bg-card text-card-foreground">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Mais relevantes</SelectItem>
              <SelectItem value="price-asc">Menor preco</SelectItem>
              <SelectItem value="price-desc">Maior preco</SelectItem>
              <SelectItem value="year-desc">Ano mais novo</SelectItem>
              <SelectItem value="mileage-asc">Menor km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              resultCount={initialVehicles.length}
            />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/50"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-background p-5 shadow-xl">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onClose={() => setShowFilters(false)}
                resultCount={initialVehicles.length}
              />
            </div>
          </div>
        )}

        {/* Vehicle grid */}
        <div className="flex-1">
          {initialVehicles.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {initialVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
              <p className="font-mono text-lg font-bold text-foreground">
                Nenhum veiculo encontrado
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar os filtros para encontrar mais resultados.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
