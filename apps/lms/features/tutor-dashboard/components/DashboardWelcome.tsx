"use client";

import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { DashboardLink } from "./DashboardLink";
import styles from "./dashboard.module.css";

export function DashboardWelcome() {
  const fullName = useAuthStore((state) => state.user?.fullName);
  const name = fullName?.trim().split(/\s+/).pop() || "Gia sư";

  return (
    <section className={`${styles.welcome} relative overflow-hidden rounded-3xl border border-primary bg-primary p-6 text-primary-foreground shadow-soft md:rounded-[32px] md:p-8`}>
      <div className={`${styles.welcomeContent} relative max-w-3xl`}>
        <h1 className="text-2xl font-extrabold leading-[1.25] [overflow-wrap:anywhere] md:text-3xl">
          Chào {name}, cùng bắt đầu buổi dạy nhé!
        </h1>
        <p className="mt-3 max-w-[42ch] text-base leading-relaxed">
          Theo dõi lịch dạy, chuẩn bị tài liệu và đồng hành cùng học viên.
        </p>
        <DashboardLink href="/lms/tutor/schedule" variant="accent" className="mt-5">
          Xem lịch dạy <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </DashboardLink>
      </div>
      <Image
        src="/images/bee-phone.png"
        alt=""
        width={1440}
        height={1440}
        sizes="(min-width: 1280px) 260px, 220px"
        loading="eager"
        className={`${styles.mascot} pointer-events-none absolute bottom-0 object-contain`}
      />
    </section>
  );
}
