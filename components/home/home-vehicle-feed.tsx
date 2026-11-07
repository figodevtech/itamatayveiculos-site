"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import type { HomeVehiclesPage } from "@/types/vehicle";

interface HomeVehicleFeedProps {
  initialPage: HomeVehiclesPage;
  primaryColor?: string;
}

const homeImageSizes = "(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 48px) / 2), (max-width: 1279px) calc((100vw - 96px) / 4), 292px";

export function HomeVehicleFeed({ initialPage, primaryColor }: HomeVehicleFeedProps) {
  const [vehicles, setVehicles] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMore || !cursor) return;
    inFlightRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vehicles/home?cursor=${encodeURIComponent(cursor)}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Não foi possível carregar mais veículos.");
      const page: HomeVehiclesPage = await response.json();
      setVehicles((current) => {
        const knownIds = new Set(current.map((vehicle) => vehicle.id));
        return [...current, ...page.items.filter((vehicle) => {
          if (knownIds.has(vehicle.id)) return false;
          knownIds.add(vehicle.id);
          return true;
        })];
      });
      setCursor(page.nextCursor);
      setHasMore(page.hasMore && Boolean(page.nextCursor) && page.nextCursor !== cursor);
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Não foi possível carregar mais veículos.");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        inFlightRef.current = false;
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
  }, [cursor, hasMore]);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading || error || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void loadMore();
    }, { rootMargin: "500px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, hasMore, isLoading, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} primaryColor={primaryColor} imageSizes={homeImageSizes} />)}
      </div>
      {vehicles.length === 0 && <p className="py-8 text-center text-muted-foreground">Nenhum veículo disponível no momento.</p>}
      {hasMore && (
        <div ref={sentinelRef} className="mt-6 flex min-h-12 flex-col items-center gap-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button variant="outline" disabled={isLoading} onClick={() => void loadMore()} aria-busy={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Carregando veículos..." : error ? "Tentar novamente" : "Carregar mais veículos"}
          </Button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{vehicles.length} veículos carregados.</p>
    </>
  );
}
