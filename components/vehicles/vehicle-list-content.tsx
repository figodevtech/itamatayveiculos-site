"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard } from "@/components/vehicle-card";
import { FilterSidebar } from "@/components/vehicles/filter-sidebar";
import { useUserConfig } from "@/contexts/user-config";
import type { Vehicle } from "@/lib/vehicles";
import { fadeUp, premiumEase, staggerContainer } from "@/lib/motion";

interface VehicleListContentProps {
  initialVehicles: Vehicle[];
  basePath?: string;
  title?: string;
}

interface ActiveFilter {
  key: "brand" | "bodyType" | "fuelType" | "priceRange" | "yearMin" | "yearMax";
  label: string;
}

export function VehicleListContent({
  initialVehicles,
  basePath = "/veiculos",
  title = "Veículos à venda",
}: VehicleListContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { primaryColor } = useUserConfig();
  const [isPending, startTransition] = useTransition();
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

  const navigateWithParams = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();
      startTransition(() => {
        router.push(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
      });
    },
    [basePath, router],
  );

  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const params = new URLSearchParams(searchParams.toString());
      const newValue = value as string;

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

      navigateWithParams(params);
    },
    [navigateWithParams, searchParams],
  );

  const handleClearFilters = useCallback(() => {
    startTransition(() => router.push(basePath, { scroll: false }));
  }, [basePath, router]);

  const removeFilter = useCallback(
    (key: ActiveFilter["key"]) => {
      const params = new URLSearchParams(searchParams.toString());
      const paramKeys: Record<Exclude<ActiveFilter["key"], "priceRange">, string> = {
        brand: "marca",
        bodyType: "tipo",
        fuelType: "combustivel",
        yearMin: "anoMin",
        yearMax: "anoMax",
      };

      if (key === "priceRange") {
        params.delete("precoMin");
        params.delete("precoMax");
      } else {
        params.delete(paramKeys[key]);
      }

      navigateWithParams(params);
    },
    [navigateWithParams, searchParams],
  );

  const activeFilters: ActiveFilter[] = [
    ...(filters.brand !== "all" ? [{ key: "brand" as const, label: filters.brand }] : []),
    ...(filters.bodyType ? [{ key: "bodyType" as const, label: filters.bodyType }] : []),
    ...(filters.fuelType ? [{ key: "fuelType" as const, label: filters.fuelType }] : []),
    ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 400000
      ? [{
          key: "priceRange" as const,
          label: `R$ ${filters.priceRange[0].toLocaleString("pt-BR")} – R$ ${filters.priceRange[1].toLocaleString("pt-BR")}`,
        }]
      : []),
    ...(filters.yearMin !== "any" ? [{ key: "yearMin" as const, label: `Desde ${filters.yearMin}` }] : []),
    ...(filters.yearMax !== "any" ? [{ key: "yearMax" as const, label: `Até ${filters.yearMax}` }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <motion.header
        data-motion-reveal=""
        className="mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={fadeUp} className="font-mono text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-1 text-sm text-muted-foreground" aria-live="polite">
          {initialVehicles.length} veículos encontrados
        </motion.p>
      </motion.header>

      <div className="mb-4 flex items-center justify-between">
        <Drawer open={showFilters} onOpenChange={setShowFilters} direction="left">
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-[min(20rem,90vw)] overflow-y-auto p-5 lg:hidden">
            <DrawerTitle className="sr-only">Filtros de veículos</DrawerTitle>
            <DrawerDescription className="sr-only">
              Refine a lista por marca, carroceria, combustível, preço e ano.
            </DrawerDescription>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onClose={() => setShowFilters(false)}
              resultCount={initialVehicles.length}
            />
          </DrawerContent>
        </Drawer>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-lg border border-border p-0.5 md:flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-[color,background-color,transform] active:scale-95 ${
                viewMode === "grid"
                  ? `${primaryColor ? "" : "bg-primary"} text-primary-foreground`
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={viewMode === "grid" && primaryColor ? { backgroundColor: primaryColor } : undefined}
              aria-label="Visualizar em grade"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-[color,background-color,transform] active:scale-95 ${
                viewMode === "list"
                  ? `${primaryColor ? "" : "bg-primary"} text-primary-foreground`
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={viewMode === "list" && primaryColor ? { backgroundColor: primaryColor } : undefined}
              aria-label="Visualizar em lista"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger className="w-44 bg-card text-card-foreground">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Mais relevantes</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="year-desc">Ano mais novo</SelectItem>
              <SelectItem value="mileage-asc">Menor km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {activeFilters.length > 0 && (
          <motion.div
            className="mb-5 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Filtros ativos"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {activeFilters.map((filter) => (
                <motion.button
                  layout
                  key={filter.key}
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: premiumEase }}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  aria-label={`Remover filtro ${filter.label}`}
                >
                  {filter.label}
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        <motion.aside
          data-motion-reveal=""
          className="hidden w-64 shrink-0 lg:block"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: premiumEase }}
        >
          <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              resultCount={initialVehicles.length}
            />
          </div>
        </motion.aside>

        <motion.div
          className="min-w-0 flex-1"
          animate={{ opacity: isPending ? 0.65 : 1 }}
          transition={{ duration: 0.2 }}
          aria-busy={isPending}
        >
          <AnimatePresence initial={false} mode="wait">
            {initialVehicles.length > 0 ? (
              <motion.div
                key="vehicle-results"
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
                }
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {initialVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: premiumEase }}
                      className="h-full"
                    >
                      <VehicleCard vehicle={vehicle} primaryColor={primaryColor} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty-results"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center"
              >
                <p className="font-mono text-lg font-bold text-foreground">Nenhum veículo encontrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar os filtros para encontrar mais resultados.
                </p>
                <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                  Limpar filtros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
