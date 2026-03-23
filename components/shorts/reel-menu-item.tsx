"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Heart,
  Share2,
  Info,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types/vehicle";
import Link from "next/link";

export interface VehicleReelItem {
  id: string;
  vehicle: Vehicle;
  videoUrl: string;
  likes: number;
  shares: number;
  saves: number;
}

interface ReelMenuItemProps {
  item: VehicleReelItem;
  isActive: boolean;
  isNearby: boolean;
  isMuted: boolean;
  modalOpen: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onOpenDetails: () => void;
  onToggleMute: () => void;
  isLiked: boolean;
  isSaved: boolean;
}

export function ReelMenuItem({
  item,
  isActive,
  isNearby,
  isMuted,
  modalOpen,
  onLike,
  onSave,
  onShare,
  onOpenDetails,
  onToggleMute,
  isLiked,
  isSaved,
}: ReelMenuItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);
  const playIconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shouldPlay = isActive && !modalOpen;

  // Handle play/pause based on active state and modal
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay was prevented
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  // Update muted state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Handle tap to play/pause
  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double tap - like
      onLike(item.id);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 800);
    } else {
      // Single tap - play/pause
      const video = videoRef.current;
      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play().catch(() => { });
        }
        setShowPlayIcon(true);
        if (playIconTimeoutRef.current) {
          clearTimeout(playIconTimeoutRef.current);
        }
        playIconTimeoutRef.current = setTimeout(() => {
          setShowPlayIcon(false);
        }, 400);
      }
    }

    lastTapRef.current = now;
  }, [isPlaying, item.id, onLike]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString("pt-BR") + " km";
  };

  const vehicleName = `${item.vehicle.brand} ${item.vehicle.model} ${item.vehicle.version}`;
  const posterUrl = item.vehicle.image || "";

  // Render placeholder for non-nearby items
  if (!isNearby && !isActive) {
    return (
      <div className="h-full w-full snap-start snap-always relative flex items-center justify-center bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-60"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="relative z-10 text-center text-white">
          <h3 className="text-xl font-bold">{vehicleName}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full snap-start snap-always relative overflow-hidden bg-black">
      {/* Video Layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={item.videoUrl}
        poster={posterUrl}
        muted={isMuted}
        loop
        playsInline
        preload={isActive ? "auto" : "metadata"}
        onClick={handleTap}
        aria-label={`Vídeo do veículo ${vehicleName}`}
      />

      {/* Buffering Indicator */}
      {isBuffering && isActive && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Play/Pause Icon Feedback */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-black/40 rounded-full p-4 animate-in fade-in zoom-in duration-200">
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Double Tap Like Animation */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <Heart
            className="w-24 h-24 text-red-500 fill-red-500 animate-in zoom-in duration-300"
            style={{
              animation: "likeAnimation 0.8s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mute Toggle */}
      <button
        onClick={onToggleMute}
        className="absolute top-[calc(1rem+env(safe-area-inset-top))] right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-colors"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* Right Action Buttons */}
      <div className="absolute right-4 bottom-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-5 z-20">
        <button
          onClick={() => onLike(item.id)}
          className="flex flex-col items-center gap-1 text-white"
          aria-label={`Curtir ${vehicleName}`}
        >
          <div
            className={cn(
              "rounded-full p-3 transition-all",
              isLiked
                ? "bg-red-500/20 text-red-500"
                : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
            )}
          >
            <Heart
              className={cn("w-7 h-7", isLiked && "fill-red-500 text-red-500")}
            />
          </div>
          {/* <span className="text-xs font-medium">
            {formatNumber(item.likes + (isLiked ? 1 : 0))}
          </span> */}
        </button>

        <button
          onClick={() => onShare(item.id)}
          className="flex flex-col items-center gap-1 text-white"
          aria-label={`Compartilhar ${vehicleName}`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors">
            <Share2 className="w-7 h-7" />
          </div>
          {/* <span className="text-xs font-medium">
            {formatNumber(item.shares)}
          </span> */}
        </button>

        <button
          onClick={onOpenDetails}
          className="flex flex-col items-center gap-1 text-white"
          aria-label={`Ver detalhes de ${vehicleName}`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors">
            <Info className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium">Info</span>
        </button>

        {/* <button
          onClick={() => onSave(item.id)}
          className="flex flex-col items-center gap-1 text-white"
          aria-label={`Salvar ${vehicleName}`}
        >
          <div
            className={cn(
              "rounded-full p-3 transition-all",
              isSaved
                ? "bg-amber-500/20 text-amber-500"
                : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
            )}
          >
            <Bookmark
              className={cn(
                "w-7 h-7",
                isSaved && "fill-amber-500 text-amber-500"
              )}
            />
          </div>
          <span className="text-xs font-medium">
            {formatNumber(item.saves + (isSaved ? 1 : 0))}
          </span>
        </button> */}
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-20 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
            {item.vehicle.year}
          </Badge>
          {item.vehicle.mileage !== null && item.vehicle.mileage !== undefined && (
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
              {formatMileage(item.vehicle.mileage)}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
            {item.vehicle.transmission}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
            {item.vehicle.fuel}
          </Badge>
        </div>

        <h2 className="text-md font-bold text-white mb-1 text-balance">
          {vehicleName}
        </h2>

        {item.vehicle.description && (
          <p className="text-white/80 text-xs mb-3 line-clamp-2">
            {item.vehicle.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          <span className="text-2xl font-bold text-white">
            {formatPrice(item.vehicle.price)}
          </span>

          <Button
            className="bg-white text-black hover:bg-white/90 font-semibold px-6"
            aria-label={`Falar sobre ${vehicleName}`}
            asChild
          >
            <Link href={`/veiculos/${item.vehicle.id}`}>
              <Info className="w-4 h-4 mr-2" />
              Ver Anúncio
            </Link>
          </Button>
        </div>
      </div>

      {/* CSS for like animation */}
      <style jsx>{`
        @keyframes likeAnimation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          15% {
            transform: scale(1.2);
            opacity: 1;
          }
          30% {
            transform: scale(0.95);
          }
          45% {
            transform: scale(1.05);
          }
          60% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
