"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const HERO_MASCOT =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1790241794/Bee_Robot_2.png";

function HeroMascot() {
  const reduceMotion = useReducedMotion();
  const loop = {
    duration: 4.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <div className="relative mx-auto w-[190px] self-end lg:w-[230px]">
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 size-[210px] -translate-x-1/2 rounded-full border-2 border-primary-foreground/15 lg:size-[250px]"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-6 size-[150px] -translate-x-1/2 rounded-full border border-primary-foreground/20 lg:size-[180px]"
      />
      <motion.span
        aria-hidden="true"
        className="absolute -bottom-1 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full bg-foreground/30 blur-md"
        animate={reduceMotion ? undefined : { scaleX: [1, 0.78, 1], opacity: [0.9, 0.55, 0.9] }}
        transition={loop}
      />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.94 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                y: loop,
                rotate: { ...loop, duration: 6 },
              }
        }
        className="relative mb-3"
      >
        <Image
          src={HERO_MASCOT}
          alt="Ong BeeWise và robot bắt tay nhau"
          width={230}
          height={172}
          priority
          sizes="(min-width: 1024px) 230px, 190px"
          className="h-auto w-full drop-shadow-[0_14px_12px_rgba(10,4,55,0.35)]"
        />
      </motion.div>
    </div>
  );
}

type ClassesHeroProps = {
  /** The search box only makes sense once classes exist. */
  showControls: boolean;
  query: string;
  onQueryChange: (value: string) => void;
};

export function ClassesHero({
  showControls,
  query,
  onQueryChange,
}: ClassesHeroProps) {
  return (
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-6 pt-8 md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_270px] lg:pt-10">
          <div className={showControls ? "pb-5" : "pb-8 lg:pb-12"}>
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
              Lớp nhóm BeeWise
            </p>
            <h1 className="font-nunito text-3xl font-black leading-[1.15] tracking-tight text-primary-foreground sm:text-[40px]">
              Tìm lớp học
            </h1>

            {showControls && (
              <div className="mt-6 max-w-xl">
                <label
                  htmlFor="class-search"
                  className="mb-2 block text-xs font-bold text-primary-foreground"
                >
                  Bạn muốn học gì?
                </label>
                <div className="flex h-14 items-center gap-3 rounded-full bg-background px-5 text-foreground shadow-pop ring-2 ring-transparent transition-shadow focus-within:ring-accent">
                  <MagnifyingGlassIcon className="size-5 shrink-0 text-primary" />
                  <input
                    id="class-search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Môn học, khối lớp hoặc tên lớp"
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => onQueryChange("")}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden self-end md:block">
            <HeroMascot />
          </div>
        </div>
      </div>
    </section>
  );
}
