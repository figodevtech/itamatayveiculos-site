"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import { track } from "@vercel/analytics";
import { getInsuranceWhatsAppUrl, INSURANCE_MESSAGES } from "@/lib/insurance-config";

export function InsuranceMobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling slightly down past the hero top (e.g. 150px)
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const url = getInsuranceWhatsAppUrl(INSURANCE_MESSAGES.mobileBar);

  const handleClick = () => {
    try {
      track("insurance_whatsapp_click", {
        location: "mobile_fixed_bottom_bar",
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore analytics errors
    }
  };

  return (
    <aside
      aria-label="Ação rápida de contato"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-lg transition-transform duration-300 md:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Seguro Auto Itamatay
          </p>
          <p className="truncate text-sm font-bold text-foreground">
            Cotação personalizada
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-md transition-all active:scale-95"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Cotar no WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
