"use client";

import type { RefObject } from "react";
import { Button } from "../ui/button";

type Stage =
  | "loading"
  | "ready"
  | "exchanging"
  | "register"
  | "link"
  | "error"
  | "expired"
  | "sale-required"
  | "complete";

export function GoogleIdentityControl({
  buttonRef,
  stage,
  errorMessage,
  retryAfter,
  isBusy,
  saleRegistrationUrl,
  onRetry,
}: {
  buttonRef: RefObject<HTMLDivElement | null>;
  stage: Stage;
  errorMessage: string | null;
  retryAfter: number;
  isBusy: boolean;
  saleRegistrationUrl: string;
  onRetry: () => void;
}) {
  const isWorking =
    stage === "loading" || stage === "exchanging" || stage === "complete";
  return (
    <div
      className="relative mx-auto w-full max-w-[400px] space-y-2"
      aria-live="polite"
    >
      <div
        ref={buttonRef}
        className={
          stage === "ready"
            ? "flex min-h-10 font-google-sans! w-full items-center justify-center"
            : "invisible absolute w-full pointer-events-none"
        }
        aria-label="Đăng nhập bằng Google"
      />
      {isWorking && (
        <div
          role="status"
          className="flex min-h-10 items-center justify-center rounded-xl border border-border bg-background px-3 text-xs font-google-sans text-foreground/70"
        >
          {stage === "loading"
            ? "Đang chuẩn bị Google..."
            : stage === "exchanging"
              ? "Đang xác minh tài khoản..."
              : "Đang chuyển trang..."}
        </div>
      )}
      {(stage === "error" || stage === "expired") && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-foreground">
          <p role="alert">
            {errorMessage || "Phiên Google đã hết hạn. Vui lòng bắt đầu lại."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={retryAfter > 0 || isBusy}
            className="mt-2 rounded-lg transition-all active:scale-[0.98]"
          >
            {retryAfter > 0 ? `Thử lại sau ${retryAfter}s` : "Bắt đầu lại"}
          </Button>
        </div>
      )}
      {stage === "sale-required" && (
        <div className="rounded-xl border border-border bg-background p-3 text-xs text-foreground">
          <p role="alert">
            {errorMessage ||
              "Vui lòng đăng ký tài khoản trên BeeWise Sale trước khi dùng LMS."}
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-2 rounded-lg transition-all active:scale-[0.98]"
          >
            <a href={saleRegistrationUrl}>Đăng ký trên BeeWise</a>
          </Button>
        </div>
      )}
    </div>
  );
}
