"use client";
import { Button } from '@workspace/ui/components/ui/button';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login" | "register";
}

export function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  const url =
    variant === "register"
      ? "/images/BeeWiseTeam-2.JPG"
      : "https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561331/beewise/BeeWiseTeam.jpg";
  const router = useRouter();

  return (
    <div className="h-[100dvh] flex overflow-hidden">
      <div className="hidden lg:flex relative w-[55%] shrink-0 overflow-hidden">
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
                src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
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
              "Gia nhập BeeWise —<br />
              Kiến tạo tương lai."
            </blockquote>
            <p className="text-sm text-white/70">
              Hàng nghìn học viên đã tìm được gia sư phù hợp cùng BeeWise.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col items-center bg-background px-4 py-6 md:py-10 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-[500px] flex flex-col justify-center min-h-full">
          <div className="mb-4 self-start">
            <Button
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-full px-4 h-10 transition-colors -ml-4"
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft weight="bold" className="w-4 h-4" />
              <span className="font-semibold text-sm">Quay lại</span>
            </Button>
          </div>
          <div
            className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-xl
              shadow-xl shadow-primary/5 p-6 sm:p-8"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
