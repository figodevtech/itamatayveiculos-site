"use client";

import { motion } from "motion/react";
import { subtleTap } from "@/lib/motion";

function ShortsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.77 10.32l-1.2-.5a3.98 3.98 0 00-2.4-3.37l-.55-.23a4 4 0 00-5.13 2.34l-.23.55a3.98 3.98 0 00.64 4.03l-.84.35a4 4 0 00-2.34 5.13l.23.55a4 4 0 005.13 2.34l1.2.5a3.98 3.98 0 002.4 3.37l.55.23a4 4 0 005.13-2.34l.23-.55a3.98 3.98 0 00-.64-4.03l.84-.35a4 4 0 002.34-5.13l-.23-.55a4 4 0 00-5.13-2.34zm-3.77 6.18V11l4 2.75-4 2.75z" />
    </svg>
  );
}

export function ShortsButton() {
  return (
    <motion.span
      className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-red-500/30 transition-shadow hover:cursor-pointer hover:shadow-md hover:shadow-red-500/40"
      style={{ background: "linear-gradient(to right, #f43f5e, #ef4444, #f97316)" }}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={subtleTap}
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/30">
        <ShortsIcon className="h-3.5 w-3.5" />
      </span>
      <span className="relative font-semibold tracking-wide">Shorts</span>
      <span className="absolute right-1 top-0.5 rounded-full bg-yellow-400 px-1.5 text-[8px] font-bold uppercase tracking-wide text-yellow-900 shadow-sm">
        New
      </span>
    </motion.span>
  );
}
