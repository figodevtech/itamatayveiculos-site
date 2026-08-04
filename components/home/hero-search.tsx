"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Car, DollarSign, LoaderCircle, Search } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBrands } from "@/lib/vehicles";
import { fadeIn, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const priceRanges = [
  { value: "0-80000", label: "Até R$ 80.000" },
  { value: "80000-120000", label: "R$ 80.000 - R$ 120.000" },
  { value: "120000-200000", label: "R$ 120.000 - R$ 200.000" },
  { value: "200000-999999", label: "Acima de R$ 200.000" },
];

const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

export function HeroSearch() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [yearRange, setYearRange] = useState("");
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getBrands().then(setBrandsList);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (brand) params.set("marca", brand);
    if (priceRange) params.set("preco", priceRange);
    if (yearRange) params.set("ano", yearRange);

    startTransition(() => {
      router.push(`/veiculos?${params.toString()}`);
    });
  }

  return (
    <motion.section
      data-motion-reveal=""
      className="relative z-10 mx-auto mt-5 max-w-6xl px-4 lg:px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.div
        variants={fadeUp}
        className="rounded-2xl bg-card p-5 shadow-xl ring-1 ring-border/50 md:p-6"
      >
        <motion.h2
          variants={fadeIn}
          className="mb-4 font-mono text-lg font-bold text-card-foreground"
        >
          Encontre seu próximo veículo
        </motion.h2>

        <motion.form
          variants={fadeUp}
          className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Car className="h-3.5 w-3.5" />
              Marca
            </label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground transition-[border-color,box-shadow]">
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent position="popper">
                {brandsList.map((item) => (
                  <SelectItem
                    className="hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Faixa de preço
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground transition-[border-color,box-shadow]">
                <SelectValue placeholder="Qualquer preço" />
              </SelectTrigger>
              <SelectContent position="popper">
                {priceRanges.map((range) => (
                  <SelectItem
                    className="hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    key={range.value}
                    value={range.value}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Ano
            </label>
            <Select value={yearRange} onValueChange={setYearRange}>
              <SelectTrigger className="w-full bg-secondary text-secondary-foreground transition-[border-color,box-shadow]">
                <SelectValue placeholder="Qualquer ano" />
              </SelectTrigger>
              <SelectContent position="popper">
                {years.map((year) => (
                  <SelectItem
                    className="hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground"
                    key={year}
                    value={year}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            aria-busy={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 md:px-8"
            size="lg"
          >
            {isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Buscando..." : "Buscar"}
          </Button>
        </motion.form>

        <motion.div
          variants={fadeIn}
          className="mt-5 flex flex-wrap items-center gap-6 border-t border-border pt-4 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-card-foreground">500+</span>
            <span className="text-sm">vendas realizadas</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
