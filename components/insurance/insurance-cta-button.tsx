"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { getInsuranceWhatsAppUrl } from "@/lib/insurance-config";
import { cn } from "@/lib/utils";

interface InsuranceCtaButtonProps {
  children?: ReactNode;
  message?: string;
  trackingLocation: string;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  icon?: boolean;
}

export function InsuranceCtaButton({
  children = "Solicitar cotação pelo WhatsApp",
  message,
  trackingLocation,
  variant = "primary",
  size = "lg",
  className,
  icon = true,
}: InsuranceCtaButtonProps) {
  const url = getInsuranceWhatsAppUrl(message);

  const handleClick = () => {
    try {
      track("insurance_whatsapp_click", {
        location: trackingLocation,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore analytics errors (adblockers or offline state)
    }
  };

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-primary/20 bg-background text-foreground hover:bg-primary/5 hover:border-primary/40",
    white:
      "bg-white text-neutral-950 hover:bg-[#c8f55b] hover:text-neutral-950 shadow-lg shadow-black/10 transition-colors",
  };

  return (
    <Button
      size={size}
      className={cn(
        "rounded-full font-medium transition-all duration-200 active:scale-[0.98]",
        variantStyles[variant],
        className
      )}
      asChild
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2"
      >
        {icon && <MessageCircle className="h-5 w-5 shrink-0" />}
        <span>{children}</span>
      </Link>
    </Button>
  );
}
