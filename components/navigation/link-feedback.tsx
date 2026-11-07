"use client";

import { useLinkStatus } from "next/link";
import { LoaderCircle } from "lucide-react";

/** Render inside a Next Link to observe that link's transition. */
export function LinkFeedback() {
  const { pending } = useLinkStatus();

  return pending ? (
    <span role="status" className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/75">
      <span className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        Abrindo veículo…
      </span>
    </span>
  ) : null;
}
