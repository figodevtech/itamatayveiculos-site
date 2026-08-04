"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  fadeUp,
  premiumEase,
  quickStaggerContainer,
} from "@/lib/motion";

const mobileLinks = [
  { href: "/veiculos", label: "Comprar" },
  {
    href: "https://api.whatsapp.com/send?phone=5583981415579",
    label: "Vender",
    external: true,
  },
  { href: "/veiculos/repasses", label: "Repasses" },
  {
    href: "https://api.whatsapp.com/send?phone=5583981415579",
    label: "Financiamento",
    external: true,
  },
  { href: "/shorts", label: "Shorts" },
];

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-md p-2 transition-transform active:scale-95 md:hidden"
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Menu className="h-6 w-6 text-black" />
        )}
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 top-[74px] z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-navigation"
              className="absolute left-0 right-0 top-full z-50 border-t border-black/10 bg-white px-4 pb-4 shadow-md md:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: premiumEase }}
            >
              <motion.nav
                aria-label="Navegação mobile"
                className="flex flex-col gap-3 pt-3"
                variants={quickStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                {mobileLinks.map((item, index) => (
                  <motion.div key={item.label} variants={fadeUp}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="block rounded-md py-1 text-sm font-medium text-black/80 transition-colors hover:text-black"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
                  <div className="w-full">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full font-semibold"
                      asChild
                    >
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://api.whatsapp.com/send?phone=5583981415579&text=Ol%C3%A1,%20gostaria%20de%20anunciar%20um%20ve%C3%ADculo%20no%20seu%20site.%20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Anunciar
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
