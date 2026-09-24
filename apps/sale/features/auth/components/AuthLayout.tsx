"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login" | "register";
}

const robotImages = {
  login: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1790241795/Bee_Robot_3.png",
  register: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1790241794/Bee_Robot_2.png",
} as const;

export function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className={`${styles.layout} ${variant === "register" ? styles.registerLayout : ""}`}>
      <aside className={styles.artPanel} aria-label="BeeWise">
        <Link href="/" className={styles.brand} aria-label="BeeWise - Về trang chủ">
          <span className={styles.brandMark}>
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789964842/Logo_1.png"
              alt=""
              fill
              sizes="56px"
              className="object-contain p-1"
            />
          </span>
          <span className={styles.brandName}>BeeWise</span>
        </Link>

        <div className={styles.scene}>
          <div className={styles.backGlow} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.spark} aria-hidden="true" />
          <div className={styles.robot}>
            <Image
              src={robotImages[variant]}
              alt={variant === "login" ? "Robot BeeWise chào mừng bạn trở lại" : "Robot BeeWise chào đón thành viên mới"}
              fill
              sizes="(max-width: 1023px) 195px, (max-width: 1440px) 38vw, 520px"
              className="object-contain"
              preload
            />
          </div>
          <div className={styles.floorShadow} aria-hidden="true" />
        </div>

        <div className={styles.message}>
          <p>
            Gia nhập BeeWise,
            <br />
            <span>Kiến tạo tương lai.</span>
          </p>
          <span className={styles.caption}>
            Hàng nghìn học viên đã tìm được gia sư phù hợp cùng BeeWise.
          </span>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <Button
          className={`absolute left-3 z-10 flex items-center gap-2 rounded-full px-3 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground sm:left-5 ${variant === "register" ? "top-0 h-8 lg:top-5 lg:h-9" : "top-3 h-9 sm:top-5"}`}
          variant="ghost"
          onClick={() => router.replace("/")}
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
          <span className="text-sm font-semibold">Quay lại trang chủ</span>
        </Button>

        <div className={styles.formContainer}>
          <div className={`${styles.formCard} ${variant === "register" ? styles.registerCard : ""}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
