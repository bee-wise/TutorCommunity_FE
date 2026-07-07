"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const IMAGES = [
  { id: 1, src: "/images/Banner/Hero-1.png", alt: "BeeWise Hero 1" },
  { id: 2, src: "/images/Banner/Hero-2.png", alt: "BeeWise Hero 2" },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full  mx-auto">
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[560px] rounded-4xl overflow-hidden shadow-2xl bg-card border-4 border-white/10">
        <AnimatePresence>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[activeIndex].src}
              alt={IMAGES[activeIndex].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/30"
            }`}
            style={{ height: 8 }}
            aria-label={`Chuyển đến hình ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
