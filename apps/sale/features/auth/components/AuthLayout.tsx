"use client";
import { Button } from "@workspace/ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouteStore } from "@workspace/core/store/useRouteStore";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login" | "register";
}

export function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  const url =
    variant === "register"
      ? "/brand/BeeWiseTeam-2.JPG"
      : "/brand/BeeWiseTeam.JPG";
  const router = useRouter();
  const lastNonAuthRoute = useRouteStore((state) => state.lastNonAuthRoute);

  const handleBack = () => {
    router.replace(lastNonAuthRoute || "/");
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="relative hidden w-[48%] shrink-0 overflow-hidden lg:flex xl:w-[52%]">
        <Image
          src={url}
          alt="Đội ngũ BeeWise"
          fill
          sizes="45vw"
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="BeeWise - Về trang chủ"
          >
            <div className="relative w-10 h-10 rounded-full bg-white overflow-hidden shrink-0">
              <Image
                src="/brand/beewise-logo-nobackground.PNG"
                alt="BeeWise Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            <span
              className="text-white text-lg leading-none"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Cộng Đồng Gia Sư
            </span>
          </Link>

          <div className="text-white/90">
            <blockquote
              className="text-2xl leading-snug mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              &quot;Gia nhập BeeWise,<br />
              Kiến tạo tương lai.&quot;
            </blockquote>
            <p className="text-sm text-white/70">
              Hàng nghìn học viên đã tìm được gia sư phù hợp cùng BeeWise.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex h-dvh min-w-0 flex-1 items-center justify-center overflow-hidden bg-background px-3 pb-3 pt-14 sm:px-5 sm:pb-4 sm:pt-16">
        <Button
          className="absolute left-3 top-2 z-10 flex h-9 items-center gap-2 rounded-full px-3 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground sm:left-5 sm:top-3"
          variant="ghost"
          onClick={handleBack}
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
          <span className="text-sm font-semibold">Quay lại trang chủ</span>
        </Button>

        <div className="flex h-full w-full max-w-[520px] items-center justify-center">
          <div
            className={`w-full rounded-2xl border border-border bg-card/60 shadow-xl shadow-primary/5 backdrop-blur-xl ${
              variant === "register" ? "p-3 sm:p-4" : "p-6 sm:p-8"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
