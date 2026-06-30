"use client";

import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";

type HeroMotionProps = {
  children: React.ReactNode;
  delay?: number;
};

export function HeroMotion({ children, delay = 0 }: HeroMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
