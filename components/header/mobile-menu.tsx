"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Menu className="h-6 w-6 text-black" />
        )}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-black/10 px-4 pb-4 md:hidden shadow-md">
          <nav className="flex flex-col gap-3 pt-3">
            <Link
              href="/veiculos"
              className="text-sm font-medium text-black/80 transition-colors hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comprar
            </Link>
            <Link
              href="/veiculos"
              className="text-sm font-medium text-black/80 transition-colors hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vender
            </Link>
            <Link
              href="/veiculos"
              className="text-sm font-medium text-black/80 transition-colors hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Financiamento
            </Link>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full font-semibold"
                asChild
              >
                <Link
                  target="_blank"
                  href="https://api.whatsapp.com/send?phone=5583981415579&text=Olá,%20gostaria%20de%20anunciar%20um%20veículo%20no%20seu%20site.%20"
                >
                  Anunciar
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
