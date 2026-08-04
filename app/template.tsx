"use client"

import { motion } from "motion/react"
import { ReactNode } from "react"
import { premiumEase } from "@/lib/motion"

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      data-motion-reveal=""
      initial={{ opacity: 0.92, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: premiumEase, duration: 0.24 }}
    >
      {children}
    </motion.div>
  )
}
