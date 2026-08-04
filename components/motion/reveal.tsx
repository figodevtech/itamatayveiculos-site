"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps, Transition, Variants } from "motion/react";
import { fadeIn, fadeLeft, fadeRight, fadeUp, scaleIn, viewportOnce } from "@/lib/motion";

type RevealVariant = "fade" | "up" | "left" | "right" | "scale";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  variant?: RevealVariant;
}

interface ResponsiveRevealProps extends Omit<RevealProps, "variant"> {
  desktopDirection: "left" | "right";
}

const variantsByName: Record<RevealVariant, Variants> = {
  fade: fadeIn,
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
};

export function Reveal({
  children,
  delay = 0,
  variant = "up",
  variants = variantsByName[variant],
  initial = "hidden",
  whileInView = "visible",
  viewport = viewportOnce,
  transition,
  ...props
}: RevealProps) {
  const delayedTransition: Transition | undefined = delay
    ? { ...(transition ?? {}), delay }
    : transition;

  return (
    <motion.div
      data-motion-reveal=""
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={delayedTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ResponsiveReveal({
  desktopDirection,
  ...props
}: ResponsiveRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <Reveal
      variant={shouldReduceMotion ? "fade" : isMobile ? "up" : desktopDirection}
      {...props}
    />
  );
}
