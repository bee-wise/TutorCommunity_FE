"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@workspace/core/schemas/password.schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RecoveryField } from "./RecoveryField";

export function RecoveryEmailForm({
  initialEmail,
  portalName,
  pending,
  cooldownSeconds,
  requestError,
  onSend,
  onClearError,
}: {
  initialEmail: string;
  portalName: string;
  pending: boolean;
  cooldownSeconds: number;
  requestError: { field?: string; general?: string } | null;
  onSend: (email: string) => Promise<void>;
  onClearError: () => void;
}) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: initialEmail },
  });
  const emailField = register("email");
  const emailError = errors.email?.message || requestError?.field;

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <span
        className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-accent/20 text-primary"
        aria-hidden="true"
      >
        <EnvelopeIcon className="size-6" />
      </span>
      <h1 className="font-nunito text-2xl font-extrabold tracking-tight text-foreground">
        Quên mật khẩu?
      </h1>
      <p className="mt-2 text-sm font-google-sans leading-6 text-muted-foreground">
        Nhập email tài khoản {portalName}. BeeWise sẽ gửi mã xác minh gồm 6 chữ
        số.
      </p>

      <form
        onSubmit={handleSubmit((values) => onSend(values.email))}
        noValidate
        className="mt-6 space-y-4"
      >
        <RecoveryField
          label="Email"
          htmlFor="recovery-email"
          error={emailError}
          errorId="recovery-email-error"
        >
          <Input
            id="recovery-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "recovery-email-error" : undefined}
            disabled={pending}
            className="h-11 rounded-xl bg-background px-4 text-sm"
            {...emailField}
            onChange={(event) => {
              emailField.onChange(event);
              clearErrors("email");
              onClearError();
            }}
          />
        </RecoveryField>

        {requestError?.general && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            {requestError.general}
          </p>
        )}

        <Button
          type="submit"
          disabled={pending || cooldownSeconds > 0}
          className="h-11 w-full rounded-xl bg-primary font-extrabold text-primary-foreground transition-all active:scale-[0.98]"
        >
          {pending
            ? "Đang gửi mã..."
            : cooldownSeconds > 0
              ? `Thử lại sau ${cooldownSeconds}s`
              : "Gửi mã xác minh"}
          {!pending && cooldownSeconds === 0 && (
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Đã nhớ mật khẩu?{" "}
        <Link
          href="/login"
          className="font-bold text-primary transition-colors hover:text-primary/80"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
