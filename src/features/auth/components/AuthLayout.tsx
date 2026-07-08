"use client";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login" | "register";
}

export function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  const url =
    variant === "register"
      ? "/images/BeeWiseTeam-2.JPG"
      : "/images/BeeWiseTeam.JPG";
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
              "Gia nhập BeeWise —<br />
              Kiến tạo tương lai."
            </blockquote>
            <p className="text-sm text-white/70">
              Hàng nghìn học viên đã tìm được gia sư phù hợp cùng BeeWise.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 gap-2 relative flex items-center justify-center bg-background px-4 py-6 overflow-y-auto no-scrollbar">
        <Button
          className="absolute top-4 left-4 md:top-4 md:left-4 z-10"
          variant={"outline"}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
        <div
          className="w-full max-w-[500px] rounded-2xl border border-border bg-card/60 backdrop-blur-xl
            shadow-xl shadow-primary/5 p-6 sm:p-8 my-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
