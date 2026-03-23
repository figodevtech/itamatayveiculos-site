"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ReelMenuItem, type VehicleReelItem } from "@/components/shorts/reel-menu-item";
import { DetailsSheet } from "@/components/shorts/details-sheet";
import { ShortVideo } from "@/services/shorts";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ShortsClient({ initialVideos }: { initialVideos: ShortVideo[] }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VehicleReelItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Convert to VehicleReelItem format for UI
  const items: VehicleReelItem[] = initialVideos.map((v, i) => ({
    id: v.id,
    vehicle: v.vehicle,
    videoUrl: v.url,
    // Add dummy social metrics for now to keep the UI intact
    likes: 120 + i * 15,
    shares: 45 + i * 5,
    saves: 80 + i * 8,
  }));

  // IntersectionObserver to detect active item
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const domItems = container.querySelectorAll("[data-index]");
    domItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [items.length]);

  // Prefetch next video
  useEffect(() => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < items.length) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = items[nextIndex].videoUrl;
      link.as = "video";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [activeIndex, items]);

  const handleLike = useCallback((id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback((id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleShare = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const shareUrl = window.location.origin + `/shorts?v=${item.id}`;
    const shareData = {
      title: `${item.vehicle.brand} ${item.vehicle.model}`,
      text: item.vehicle.description || "Confira este veículo na Itamatay Veículos!",
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error("Share not supported");
      }
    } catch (err) {
      // Fallback to clipboard
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copiado para a área de transferência!", {
            description: "Agora você pode colar onde desejar.",
            duration: 3000,
          });
        } else {
          throw new Error("Navigator.clipboard not available");
        }
      } catch (clipErr) {
        // Universal fallback for non-secure contexts (IP access)
        try {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);
          
          if (successful) {
            toast.success("Link copiado!", {
              description: "Copiado usando fallback (IP/Sem HTTPS).",
              duration: 3000,
            });
          } else {
            throw new Error("ExecCommand failed");
          }
        } catch (finalErr) {
          toast.error("Não foi possível copiar o link.");
        }
      }
    }
  }, [items]);

  const handleOpenDetails = useCallback((item: VehicleReelItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const isNearby = (index: number) => {
    return Math.abs(index - activeIndex) <= 1;
  };

  // Update URL internally
  useEffect(() => {
    if (items.length > 0 && items[activeIndex]) {
      const currentId = items[activeIndex].id;
      window.history.replaceState(null, "", `/shorts?v=${currentId}`);
    }
  }, [activeIndex, items]);

  if (items.length === 0) {
    return (
      <main className="h-svh w-full flex items-center justify-center bg-black text-white">
        <p>Nenhum vídeo disponível no momento.</p>
      </main>
    );
  }

  return (
    <main className="h-svh w-full overflow-hidden bg-zinc-950 relative flex items-center justify-center">
      
      {/* Desktop Voltar (Outside phone frame) */}
      <button
        onClick={() => router.back()}
        className="hidden md:flex absolute top-6 left-6 z-50 text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-3 hover:bg-white/10 transition-colors shadow-lg items-center gap-2 pr-5"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-sm">Voltar</span>
      </button>

      {/* Simulated Mobile Device Container */}
      <div className="w-full h-full bg-black relative md:max-w-[420px] md:h-[90vh] md:max-h-[900px] md:rounded-[2.5rem] md:overflow-hidden md:border-[6px] md:border-zinc-900 md:shadow-2xl shadow-black/50">
        
        {/* Mobile Voltar (Inside frame) */}
        <button
          onClick={() => router.back()}
          className="md:hidden absolute top-4 left-4 z-50 text-white bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3 hover:bg-black/40 transition-colors shadow-lg"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth", overscrollBehaviorY: "none", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => (
          <div key={item.id} data-index={index} className="w-full h-full snap-start snap-always relative">
            <ReelMenuItem
              item={item}
              isActive={index === activeIndex}
              isNearby={isNearby(index)}
              isMuted={isMuted}
              modalOpen={modalOpen}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
              onOpenDetails={() => handleOpenDetails(item)}
              onToggleMute={handleToggleMute}
              isLiked={likedItems.has(item.id)}
              isSaved={savedItems.has(item.id)}
            />
          </div>
        ))}
      </div>

      <DetailsSheet
        item={selectedItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      </div>
    </main>
  );
}
