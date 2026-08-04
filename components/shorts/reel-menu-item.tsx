"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Heart,
  Share2,
  Info,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  onShare: (id: string) => void;
  onOpenDetails: () => void;
  onToggleMute: () => void;
  isLiked: boolean;
}

export function ReelMenuItem({
  item,
  isActive,
  isNearby,
  isMuted,
  modalOpen,
  onLike,
  onShare,
  onOpenDetails,
  onToggleMute,
  isLiked,
}: ReelMenuItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);
  const playIconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shouldPlay = isActive && !modalOpen;

  useEffect(() => {
    return () => {
      if (playIconTimeoutRef.current) clearTimeout(playIconTimeoutRef.current);
    };
  }, []);

  // Handle play/pause based on active state and modal
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let retryCount = 0;
    const maxRetries = 3;

    const attemptPlay = () => {
      if (!shouldPlay) return;

      // Explicitly set muted before play for iOS autoplay compliance
      video.muted = isMuted;

      // Hack for iOS/WebKit: if returning to a video, nudge currentTime to force re-render
      if (video.currentTime > 0) {
        video.currentTime = video.currentTime + 0.001;
      }

      // If video state is not loaded, force load
      if (video.readyState === 0) {
        video.load();
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay was prevented or failed:", error);
          setIsPlaying(false);
          
          // Retry logic
          if (retryCount < maxRetries && shouldPlay) {
            retryCount++;
            setTimeout(attemptPlay, 500 * retryCount);
          }
        });
      }
    };

    if (shouldPlay) {
      attemptPlay();
    } else {
      video.pause();
    }
  }, [isMuted, shouldPlay]);

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
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    const handleCanPlay = () => {
      setIsBuffering(false);
      if (shouldPlay) {
        video.play().catch(() => {});
      }
    };
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      // If we are active and progress is moving, we have definitely started
      if (video.currentTime > 0.1) {
        setIsBuffering(false);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [shouldPlay]);

  // Safari/iOS Hardware Decoder Cleanup + React StrictMode Fix
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // In React 18 StrictMode, the component mounts, unmounts, and remounts.
    // Our cleanup removes the 'src' from the DOM, but React's virtual DOM
    // doesn't know this, so it doesn't re-apply it on remount.
    // We must manually ensure the src is present when mounted.
    if (video.getAttribute("src") !== item.videoUrl) {
      video.setAttribute("src", item.videoUrl);
      video.load();
    }

    return () => {
      // Explictly release media resources when unmounted (not nearby)
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [item.videoUrl]);

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

  // Render simple placeholder for non-nearby items
  if (!isNearby && !isActive) {
    return (
      <div className="h-full w-full snap-start snap-always relative flex items-center justify-center bg-black text-white/40">
        <h3 className="text-xl font-bold">{vehicleName}</h3>
      </div>
    );
  }

  return (
    <div className="h-full w-full snap-start snap-always relative overflow-hidden bg-black">
      {/* Video Layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        src={item.videoUrl}
        poster={item.vehicle.image}
        muted={isMuted}
        loop
        playsInline
        autoPlay={isActive}
        preload={isActive || isNearby ? "auto" : "metadata"}
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleTap}
        aria-label={`Vídeo do veículo ${vehicleName}`}
        webkit-playsinline="true"
      />

      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering && isActive && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Icon Feedback */}
      <AnimatePresence>
        {showPlayIcon && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="rounded-full bg-black/40 p-4">
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Like Animation */}
      <AnimatePresence>
        {showLikeAnimation && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Heart className="h-24 w-24 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full origin-left bg-white transition-transform duration-100"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Mute Toggle */}
      <motion.button
        type="button"
        onClick={onToggleMute}
        className="absolute top-[calc(1rem+env(safe-area-inset-top))] right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </motion.button>

      {/* Right Action Buttons */}
      <motion.div
        className="absolute right-4 bottom-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-5 z-20"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, y: isActive || shouldReduceMotion ? 0 : 8 }}
        transition={{ duration: 0.22 }}
      >
        <motion.button
          type="button"
          onClick={() => onLike(item.id)}
          className="flex flex-col items-center gap-1 text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
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
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onShare(item.id)}
          className="flex flex-col items-center gap-1 text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          aria-label={`Compartilhar ${vehicleName}`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors">
            <Share2 className="w-7 h-7" />
          </div>
          {/* <span className="text-xs font-medium">
            {formatNumber(item.shares)}
          </span> */}
        </motion.button>

        <motion.button
          type="button"
          onClick={onOpenDetails}
          className="flex flex-col items-center gap-1 text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          aria-label={`Ver detalhes de ${vehicleName}`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors">
            <Info className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium">Info</span>
        </motion.button>

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
      </motion.div>

      {/* Bottom Info Overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-20 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, y: isActive || shouldReduceMotion ? 0 : 8 }}
        transition={{ duration: 0.22 }}
      >
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
      </motion.div>
    </div>
  );
}
