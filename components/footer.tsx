import Link from "next/link";

const footerGroups = [
  {
    title: "Comprar",
    links: [
      { href: "/veiculos", label: "Carros usados" },
      { href: "", label: "Carros novos" },
      { href: "", label: "SUVs" },
      { href: "", label: "Picapes" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { href: "", label: "Financiamento" },
      { href: "/seguro", label: "Seguro auto" },
      { href: "", label: "Tabela FIPE" },
      { href: "", label: "Consulta veicular" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "", label: "Sobre nós" },
      {
        href: "https://api.whatsapp.com/send?phone=5583981415579&text&type=phone_number&app_absent=0&utm_source=ig",
        label: "Contato",
        external: true,
      },
      { href: "", label: "Termos de uso" },
      { href: "", label: "Política de privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-border bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-4"
        >
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span className="font-mono text-lg font-bold">Itamatay Veículos®</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              O maior marketplace de veículos do Brasil. Encontre o carro dos
              seus sonhos com segurança e facilidade.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="inline-block text-sm text-primary-foreground/70 transition-[color,transform] hover:translate-x-0.5 hover:text-primary-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6">
          <p className="text-center text-xs text-primary-foreground/50">
            2026 Itamatay Veículos®. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs text-primary-foreground/50">
            Powered By{" "}
            <Link className="underline" href="https://figosoftwares.com.br" target="_blank" rel="noopener noreferrer">
              FIGO
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
