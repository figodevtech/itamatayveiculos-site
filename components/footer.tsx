import Link from "next/link"
import { Car } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">

              <span className="font-mono text-lg font-bold">Alan Car</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              O maior marketplace de veiculos do Brasil. Encontre o carro dos
              seus sonhos com seguranca e facilidade.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Comprar
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/veiculos"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Carros usados
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Carros novos
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  SUVs
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Picapes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Servicos
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Financiamento
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Seguro auto
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Tabela FIPE
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Consulta veicular
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Institucional
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Sobre nos
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://wa.me/send/?phone=5583982209260&text&type=phone_number&app_absent=0&utm_source=ig"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link
                  href=""
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Politica de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6">
          <p className="text-center text-xs text-primary-foreground/50">
            2026 Alan Car. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs text-primary-foreground/50">
            Powered By FIGO</p>
        </div>
      </div>
    </footer>
  )
}
