"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** History/BFCache snapshots may predate an ERP publication. Preserve scroll and refresh data. */
export function HistoryRefresh() {
  const router = useRouter();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => router.refresh(), 0);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };
    window.addEventListener("popstate", refresh);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("popstate", refresh);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);

  return null;
}
