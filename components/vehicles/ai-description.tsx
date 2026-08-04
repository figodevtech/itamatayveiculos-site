"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { premiumEase } from "@/lib/motion";

interface AIDescriptionBoxProps {
  children?: ReactNode;
  text?: string;
  className?: string;
}

export function AIDescriptionBox({
  children,
  text,
  className = "",
}: AIDescriptionBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const contentId = useId();
  const content = children || text;

  if (!content) return null;

  return (
    <motion.div layout className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 opacity-60 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 blur-xl" />

      <motion.div layout className="relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-violet-500/5" />

        <div className="relative flex flex-1 flex-col items-start p-5 sm:p-6 md:p-8">
          <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex w-fit items-center gap-1.5 rounded-full border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 px-2.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-xs font-medium text-transparent">
                Gerado por IA
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              className="flex items-center gap-1.5 rounded-md py-1 text-sm font-medium text-cyan-500 transition-colors hover:text-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-expanded={isExpanded}
              aria-controls={contentId}
            >
              <span>{isExpanded ? "Ocultar descrição" : "Ver descrição da IA"}</span>
              <motion.span
                initial={false}
                animate={{ rotate: isExpanded && !shouldReduceMotion ? 180 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: premiumEase }}
                className="flex items-center justify-center"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={contentId}
                layout
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: premiumEase }}
                className="relative w-full overflow-hidden"
              >
                <div className="break-words pb-2 text-base font-normal leading-relaxed tracking-wide text-foreground/90 sm:text-lg">
                  {content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
