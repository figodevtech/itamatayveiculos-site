"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareVehicleButtonProps {
  title: string;
  text: string;
}

export function ShareVehicleButton({ title, text }: ShareVehicleButtonProps) {
  const handleShare = async () => {
    // Page URL without query string/hash, so filters or tracking params aren't shared.
    const url = `${window.location.origin}${window.location.pathname}`;
    const shareData = { title, text, url };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // The visitor closed the share sheet: nothing else to do.
        if (error instanceof DOMException && error.name === "AbortError") return;
        // Any other failure falls through to copying the link.
      }
    }

    if (await copyToClipboard(url)) {
      toast.success("Link copiado!", {
        description: "Agora é só colar onde quiser.",
        duration: 3000,
      });
    } else {
      toast.error("Não foi possível compartilhar", { description: url });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Compartilhar veículo"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Compartilhar</span>
    </Button>
  );
}

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back below.
  }

  // Clipboard API is unavailable outside HTTPS (e.g. testing over a LAN IP).
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}
