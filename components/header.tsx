"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MobileMenu } from "./header/mobile-menu";
import { ShortsButton } from "./shorts/shorts-button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ease-in-out will-change-[background-color,backdrop-filter,box-shadow]",
        isScrolled
          ? "bg-white/40 backdrop-blur-sm border-b border-white/10 shadow-lg"
          : "bg-white shadow-md",
      )}
    >
      <div className="mx-auto flex items-center relative justify-center md:justify-between px-6 lg:px-10 py-3">
        <MobileMenu />

        <Link href="/" className="flex items-center gap-2 flex-row">
          <Image
            height={50}
            width={50}
            src="/images/logos/itamatay-logo.png"
            alt="logo"
          />
          <span className="text-xl font-bold text-primary">Itamatay</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/veiculos"
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Comprar
          </Link>
          <Link
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=5583981415579`}
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Vender
          </Link>
          <Link
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=5583981415579`}
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            Financiamento
          </Link>
          <Link
            href="/shorts"
            className="text-sm font-medium text-black/80 transition-colors hover:text-black"
          >
            <ShortsButton />
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
              href="https://api.whatsapp.com/send?phone=5583981415579&text=Olá,%20gostaria%20de%20anunciar%20um%20veículo%20no%20seu%20site.%20"
            >
              Anunciar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
