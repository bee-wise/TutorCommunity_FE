"use client";
import { Button } from "@workspace/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login";
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#f8f9fc]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#280f91]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#ffc500]/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-[#280f91]/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/brand/grid-pattern.svg')] bg-repeat opacity-[0.02] invert" />
      </div>

      <div className="w-full max-w-[500px] px-4 z-10">
        <div
          className="w-full rounded-3xl bg-white
            shadow-xl shadow-[#280f91]/5 p-6 sm:p-10 relative overflow-hidden"
        >
          {children}
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-[#0c0c0b]/40">
            Hệ thống quản trị nội bộ BeeWise. <br />© {new Date().getFullYear()}{" "}
            BeeWise Education.
          </p>
        </div>
      </div>
    </div>
  );
}
