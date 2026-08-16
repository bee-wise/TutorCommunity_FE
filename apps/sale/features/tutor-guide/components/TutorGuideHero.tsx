"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CheckCircleIcon, ShieldCheckIcon } from "@phosphor-icons/react";

const PROOFS = [
  "Hồ sơ được xác thực trước khi hiển thị",
  "Chủ động chọn học viên phù hợp",
  "Có cố vấn hỗ trợ trong quá trình kết nối",
];

export function TutorGuideHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background pt-24 sm:pt-28" aria-labelledby="tutor-guide-h1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,197,0,0.18),transparent_30%),radial-gradient(circle_at_8%_88%,rgba(40,15,145,0.08),transparent_34%)]" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[calc(100dvh-7rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:px-8">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
            <ShieldCheckIcon size={20} weight="fill" aria-hidden="true" />
            Cộng đồng gia sư được xác thực
          </div>
          <h1 id="tutor-guide-h1" className="font-montserrat font-extrabold leading-[1.12] tracking-tight text-primary">
            <span className="block text-[2.15rem] sm:text-[2.65rem] lg:text-[2.85rem]">Dạy đúng thế mạnh.</span>
            <span className="mt-2 block text-[1.85rem] text-accent sm:text-[2.15rem] lg:text-[2.35rem]">Nhận lớp đúng nhu cầu.</span>
          </h1>
          <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-foreground/70 sm:text-lg">
            BeeWise giúp bạn xây dựng hồ sơ đáng tin cậy, gặp học viên phù hợp và có người đồng hành từ lần trao đổi đầu tiên.
          </p>
          <Link href="/register" id="hero-cta-register" className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_12px_30px_rgba(40,15,145,0.2)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0">
            Tạo hồ sơ gia sư
            <ArrowRightIcon size={17} weight="bold" aria-hidden="true" />
          </Link>
          <ul className="mt-8 grid gap-3" role="list">
            {PROOFS.map((proof) => (
              <li key={proof} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/65">
                <CheckCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                {proof}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted shadow-[0_28px_70px_rgba(40,15,145,0.16)]">
            <Image src="/brand/BeeWiseTeam-2.JPG" alt="Đội ngũ BeeWise đồng hành cùng cộng đồng gia sư" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
