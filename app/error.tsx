"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
    <h1 className="text-2xl font-bold">Não foi possível carregar esta página</h1>
    <p className="text-muted-foreground">Ocorreu uma falha de conexão. Tente novamente em instantes.</p>
    <button type="button" onClick={reset} className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Tentar novamente</button>
    <Link href="/" className="text-sm underline">Voltar para o início</Link>
  </main>;
}
