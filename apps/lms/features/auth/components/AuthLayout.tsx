"use client";
import { createContext, useContext, useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login"; // LMS only has login
  compact?: boolean;
}

const LmsAccessActivationContext = createContext<(() => void) | null>(null);

export function useLmsAccessActivation() {
  const openDialog = useContext(LmsAccessActivationContext);
  if (!openDialog) {
    throw new Error("useLmsAccessActivation must be used within AuthLayout");
  }
  return openDialog;
}

export function AuthLayout({ children, compact = false }: AuthLayoutProps) {
  const router = useRouter();
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);

  return (
    <div className={`${compact ? "h-[100dvh]" : "min-h-[100dvh]"} w-full flex flex-col items-center justify-center relative overflow-hidden bg-muted`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/brand/grid-pattern.svg')] bg-repeat opacity-[0.02] invert" />
      </div>

      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
        <Button
          className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-muted-foreground shadow-soft transition-colors hover:bg-muted hover:text-primary"
          variant="ghost"
          onClick={() => router.replace("/")}
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          <span
            className="font-semibold text-sm"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Quay lại trang chủ
          </span>
        </Button>
      </div>

      <div className={`w-full max-w-[500px] px-4 z-10 ${compact ? "pt-16" : ""}`}>
        <div
          className={`w-full rounded-3xl border border-border bg-card shadow-soft relative ${compact ? "max-h-[calc(100dvh-9rem)] overflow-y-auto p-4 sm:p-6" : "overflow-hidden p-6 sm:p-10"}`}
        >
          <LmsAccessActivationContext.Provider
            value={() => setIsAccessDialogOpen(true)}
          >
            {children}
          </LmsAccessActivationContext.Provider>
        </div>

        <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Tài khoản chưa được kích hoạt LMS</DialogTitle>
              <DialogDescription>
                Tài khoản của bạn chưa được kích hoạt quyền truy cập BeeWise
                LMS. Vui lòng liên hệ BeeWise hoặc truy cập beewise.vn để được
                hỗ trợ.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsAccessDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button asChild>
                <a
                  href="https://beewise.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Truy cập BeeWise
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Hệ thống quản trị nội bộ BeeWise. <br />© {new Date().getFullYear()}{" "}
            BeeWise Education.
          </p>
        </div>
      </div>
    </div>
  );
}
