"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { TutorGuideHeroVisual } from "./TutorGuideHeroVisual";
import { useTutorGuideHeroMotion } from "../hooks/useTutorGuideHeroMotion";

const TRUST_POINTS = [
  "Miễn phí tạo hồ sơ",
  "Xét duyệt minh bạch",
  "Chủ động lịch dạy",
];

export function TutorGuideHero() {
  const heroRef = useRef<HTMLElement>(null);
  useTutorGuideHeroMotion(heroRef);

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-[100dvh] overflow-hidden bg-background pt-24 sm:pt-28"
      aria-labelledby="tutor-guide-h1"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,197,0,0.20),transparent_26%),radial-gradient(circle_at_8%_88%,rgba(40,15,145,0.10),transparent_32%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#280f91_1px,transparent_1px),linear-gradient(to_bottom,#280f91_1px,transparent_1px)] [background-size:42px_42px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100dvh-7rem)] max-w-7xl grid-cols-1 items-center gap-y-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-6 lg:px-8 lg:pb-16">
        <div className="flex min-w-0 flex-col items-start">
          <p
            data-hero-eyebrow
            className="mb-5 flex items-center gap-3 text-sm font-bold text-primary"
          >
            Bắt đầu hành trình gia sư
          </p>

          <h1
            id="tutor-guide-h1"
            className="max-w-[12ch] font-nunito text-[2.65rem] font-black leading-[1.02] tracking-[-0.035em] text-primary sm:text-[3.8rem] lg:text-[4.2rem]"
          >
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block origin-left">
                Gia sư tại
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-hero-line className="block origin-left text-accent">
                BeeWise
              </span>
            </span>
          </h1>

          <p
            data-hero-copy
            className="mt-5 max-w-[54ch] text-base leading-7 text-foreground/68 sm:text-lg"
          >
            Cẩm nang trở thành gia sư tại BeeWise, giúp bạn dễ dàng đăng ký, dạy
            và quản lý dễ dàng hơn.
          </p>

          <div
            data-hero-copy
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              href="/register"
              id="hero-cta-register"
              className="inline-flex min-h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_rgba(40,15,145,0.22)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Đăng ký làm gia sư
              <ArrowRightIcon size={17} weight="bold" aria-hidden="true" />
            </Link>
            <a
              href="#how-to-register"
              className="inline-flex min-h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-primary/15 bg-white/75 px-6 text-sm font-bold text-primary transition-colors hover:border-primary/30 hover:bg-white"
            >
              Xem quy trình
              <ArrowDownIcon size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <TutorGuideHeroVisual />
        </div>

        <ul
          data-hero-copy
          className="grid w-full gap-3 border-t border-primary/10 pt-5 text-sm text-foreground/62 sm:grid-cols-3 sm:gap-5 lg:col-start-1 lg:row-start-2"
          aria-label="Lợi ích khi đăng ký gia sư"
        >
          {TRUST_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2 leading-5">
              <CheckCircleIcon
                size={17}
                weight="fill"
                className="shrink-0 text-accent"
                aria-hidden="true"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
