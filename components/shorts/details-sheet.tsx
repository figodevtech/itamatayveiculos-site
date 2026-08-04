"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, MapPin, GaugeCircle } from "lucide-react";
import type { VehicleReelItem } from "./reel-menu-item";
import Link from "next/link";
import { Separator } from "../ui/separator";

interface DetailsSheetProps {
  item: VehicleReelItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsSheet({ item, open, onOpenChange }: DetailsSheetProps) {
  if (!item) return null;

  const vehicle = item.vehicle;
  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.version}`;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatMileage = (mileage: number | null | undefined) => {
    if (mileage === null || mileage === undefined) return "N/A";
    return mileage.toLocaleString("pt-BR") + " km";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="h-[85vh] rounded-t-3xl bg-card text-card-foreground"
      >
        <DrawerHeader className="text-left">
          <div className="flex flex-wrap gap-2 mb-2">
            {vehicle.year && (
              <Badge variant="secondary" className="text-xs">{vehicle.year}</Badge>
            )}
            {vehicle.isNew && (
              <Badge variant="default" className="text-xs bg-emerald-600">0km</Badge>
            )}
            <Badge variant="outline" className="text-xs">{vehicle.status}</Badge>
          </div>
          <DrawerTitle className="text-2xl font-bold">{vehicleName}</DrawerTitle>
          <DrawerDescription className="text-base">
            {vehicle.description}
          </DrawerDescription>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatPrice(vehicle.price)}
          </p>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
          {/* Main Specs */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Especificações Básicas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">Câmbio</span>
                <span className="font-medium text-sm">{vehicle.transmission}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">Combustível</span>
                <span className="font-medium text-sm">{vehicle.fuel}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">Cor</span>
                <span className="font-medium text-sm">{vehicle.color}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">Carroceria</span>
                <span className="font-medium text-sm">{vehicle.bodyType}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Performance & Condition */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <GaugeCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Motor e Condição</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground mb-1">Quilometragem</span>
                <span className="font-medium text-sm">{formatMileage(vehicle.mileage)}</span>
              </div>
              {vehicle.engineSize && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-1">Motor</span>
                  <span className="font-medium text-sm">{vehicle.engineSize}</span>
                </div>
              )}
              {vehicle.horsepower ? (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-1">Potência</span>
                  <span className="font-medium text-sm">{vehicle.horsepower} cv</span>
                </div>
              ) : null}
            </div>
          </section>

          <Separator />

          {/* Opcionais/Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Opcionais</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                    {feature}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <Separator />

          {/* Local / Vendedor */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Localização</h3>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{vehicle.city} - {vehicle.state}</span>
              <span className="text-sm text-muted-foreground">Vendedor: {vehicle.sellerType === "private" ? "Particular" : "Loja/Concessionária"}</span>
            </div>
          </section>
        </div>

        <DrawerFooter className="border-t pt-4">
          <Button
            className="w-full font-semibold text-base py-6"
            size="lg"
            asChild
          >
            <Link href={`/veiculos/${vehicle.id}`}>
              Ver Anúncio Completo
            </Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
