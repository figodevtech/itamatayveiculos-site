import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

function Block({ className }: { className: string }) {
  return <div className={`rounded-lg bg-muted motion-safe:animate-pulse ${className}`} />;
}

export function VehicleListSkeleton() {
  return <div role="status" aria-label="Carregando veículos" className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
    <span className="sr-only">Carregando veículos…</span>
    <Block className="mb-2 h-8 w-48" /><Block className="mb-6 h-4 w-32" />
    <div className="flex gap-6">
      <Block className="hidden h-96 w-64 shrink-0 lg:block" />
      <div className="grid flex-1 grid-cols-2 gap-4 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map(index => <div key={index} className="overflow-hidden rounded-xl border border-border">
          <Block className="aspect-16/10 w-full" />
          <div className="space-y-3 p-4"><Block className="h-5 w-3/4" /><Block className="h-6 w-1/2" /><Block className="h-10 w-full" /></div>
        </div>)}
      </div>
    </div>
  </div>;
}

export function VehicleDetailSkeleton() {
  return <div role="status" aria-label="Carregando veículo" className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
    <span className="sr-only">Carregando veículo…</span>
    <Block className="mb-8 h-4 w-56" />
    <Block className="mb-3 h-8 w-64" /><Block className="mb-6 h-5 w-44" />
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1"><Block className="aspect-16/10 w-full rounded-xl" /><Block className="mt-4 h-16 w-full" /></div>
      <div className="w-full space-y-4 lg:w-80"><Block className="h-56 w-full" /><Block className="h-36 w-full" /></div>
    </div>
  </div>;
}

export function LoadingPage({ kind = "list" }: { kind?: "list" | "detail" | "home" }) {
  return <div className="flex min-h-screen flex-col"><Header /><main className="flex-1">
    {kind === "detail" ? <VehicleDetailSkeleton /> : kind === "home" ? <>
      <Block className="aspect-16/5 w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 py-8"><Block className="h-28 w-full" /></div>
      <VehicleListSkeleton />
    </> : <VehicleListSkeleton />}
  </main><Footer /></div>;
}
