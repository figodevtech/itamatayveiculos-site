"use client"

import Link from "next/link"
import { Car, Menu, X, User, Heart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white  text-primary-foreground shadow-md">
      <div className="mx-auto flex items-center relative justify-center md:justify-between px-6 py-3.5 lg:px-10">
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
        <Link href="/" className="flex items-center gap-2">
          {/* <Car className="h-7 w-7" /> */}
          <Image
            height={60}
            width={150}
            src="/images/logos/logo_alan_horizontal.png"
            alt="logo"
          ></Image>

        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/veiculos"
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Comprar
          </Link>
          <Link
            href=""
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Vender
          </Link>
          <Link
            href=""
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Financiamento
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-black/80 hover:bg-primary-foreground/10 hover:text-black"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favoritos</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-black/80 hover:bg-primary-foreground/10 hover:text-black"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Minha conta</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="font-semibold"
            asChild
          >
            <Link
              target="_blank"
              href="
            https://wa.me/send/?phone=5583982209260&text=Olá,%20gostaria%20de%20anunciar%20um%20veículo%20no%20seu%20site.%20
            ">Anunciar</Link>
          </Button>
        </div>

      </div>
        

      {mobileMenuOpen && (
        <div className="border-t border-black/10 px-4 pb-4 md:hidden">
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
              href="
            https://wa.me/send/?phone=5583982209260&text=Olá,%20gostaria%20de%20anunciar%20um%20veículo%20no%20seu%20site.%20
            ">Anunciar</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
