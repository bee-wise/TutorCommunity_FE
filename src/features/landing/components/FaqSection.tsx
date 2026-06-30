"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { FAQ_ITEMS } from "../data/landing.data";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="bg-white py-20 sm:py-24"
      id="faq"
      aria-labelledby="faq-headline"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-headline"
          className="text-3xl sm:text-4xl tracking-tight text-foreground mb-12 text-center"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
        >
          Câu Hỏi Thường Gặp
        </h2>

        <dl className="flex flex-col divide-y divide-border">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-5">
                <dt>
                  <button
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    className="w-full flex items-center justify-between gap-4 text-left group"
                  >
                    <span
                      className="text-base sm:text-lg text-foreground group-hover:text-primary transition-colors"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                      }}
                    >
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 w-7 h-7 rounded-full bg-border flex items-center justify-center"
                    >
                      <CaretDown
                        size={14}
                        weight="bold"
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </motion.span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-sm sm:text-base text-foreground/65 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

