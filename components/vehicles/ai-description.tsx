"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const content = children || text;

  if (!content) return null;

  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-2xl opacity-60 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-x" />

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl animate-pulse-slow" />

      {/* Main container */}
      <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden flex flex-col">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-violet-500/5 animate-shimmer pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative p-5 sm:p-6 md:p-8 flex-1 flex flex-col items-start">
          {/* Header Section: AI Badge and Toggle Button side by side or stacked */}
          <div className="flex flex-wrap items-center justify-between w-full gap-4 relative z-10">
            {/* AI Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse-slow" />
              <span className="text-xs font-medium bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                Gerado por IA
              </span>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md py-1"
            >
              <span>{isExpanded ? "Ocultar descrição" : "Ver descrição da IA"}</span>
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Animated Text Container */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="relative overflow-hidden w-full"
              >
                <div className="text-foreground/90 text-base sm:text-lg leading-relaxed tracking-wide font-normal break-words pb-2">
                  {content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
