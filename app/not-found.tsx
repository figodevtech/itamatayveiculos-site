import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return <div className="flex min-h-screen flex-col"><Header />
    <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">Este anúncio pode ter sido removido.</p>
      <Link href="/veiculos" className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Ver veículos disponíveis</Link>
    </main><Footer /></div>;
}
