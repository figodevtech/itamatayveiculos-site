"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

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
  const content = children || text;

  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-2xl opacity-60 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-x" />

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl animate-pulse-slow" />

      {/* Main container */}
      <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-violet-500/5 animate-shimmer" />

        {/* Content wrapper */}
        <div className="relative p-5 sm:p-6 md:p-8">
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse-slow" />
              <span className="text-xs font-medium bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                Gerado por IA
              </span>
            </div>
          </div>

          {/* Text content */}
          <div className="text-foreground/90 text-base sm:text-lg leading-relaxed tracking-wide font-normal break-words">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
