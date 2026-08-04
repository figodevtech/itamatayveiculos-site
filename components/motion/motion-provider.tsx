"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { premiumEase } from "@/lib/motion";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.35, ease: premiumEase }}
    >
      {children}
    </MotionConfig>
  );
}
