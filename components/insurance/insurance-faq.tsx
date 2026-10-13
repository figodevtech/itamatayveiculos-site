"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { insuranceFaq } from "@/lib/insurance-config";
import { cn } from "@/lib/utils";

export function InsuranceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
      {insuranceFaq.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `faq-trigger-${index}`;
        const contentId = `faq-content-${index}`;

        return (
          <div key={item.question} className="overflow-hidden first:rounded-t-2xl last:rounded-b-2xl">
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold text-foreground transition-colors hover:bg-secondary/40 sm:p-6 sm:text-lg"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={contentId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
