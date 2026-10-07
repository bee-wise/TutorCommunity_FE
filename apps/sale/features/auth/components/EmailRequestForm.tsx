"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import {
  getApiErrorMessage,
  handleApiError,
} from "@workspace/core/sys-libs/error-handler";
import { useCooldown } from "../hooks/useCooldown";
import { useForgotPassword } from "../hooks/usePasswordActions";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas/password.schema";
import { FormField, Input } from "./FormField";

interface EmailRequestFormProps {
  initialEmail: string;
  onSent: (email: string) => void;
}

export function EmailRequestForm({
  initialEmail,
  onSent,
}: EmailRequestFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const request = useForgotPassword();
  const cooldown = useCooldown();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: initialEmail },
  });
  const emailField = register("email");

  const onSubmit = handleSubmit(async (values) => {
    if (request.isPending || cooldown.secondsLeft > 0) return;
    setServerError(null);
    try {
      const email = values.email.trim();
      const response = await request.mutateAsync({ email });
      if (response.success === true) onSent(email);
    } catch (error) {
      const apiError = handleApiError(error);
      if (apiError.statusCode === 403) {
        setError(
          "email",
          {
            type: "server",
            message:
              apiError.code === "AUTH_CSRF_REJECTED"
                ? "Yêu cầu không hợp lệ. Vui lòng tải lại trang và thử lại."
                : "Tài khoản không tồn tại trong hệ thống",
          },
          { shouldFocus: true },
        );
        return;
      }
      if (apiError.statusCode === 429)
        cooldown.start(apiError.retryAfterSeconds ?? 60);
      setServerError(
        getApiErrorMessage(error, "Không thể gửi mã. Vui lòng thử lại."),
      );
    }
  });

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <span
        className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-primary"
        aria-hidden="true"
      >
        <EnvelopeSimple size={25} weight="duotone" />
      </span>
      <h1 className="font-nunito text-2xl font-extrabold tracking-tight text-foreground">
        Quên mật khẩu?
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Nhập email của bạn. BeeWise sẽ gửi mã xác minh gồm 6 chữ số.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
        <FormField
          label="Email"
          htmlFor="recovery-email"
          error={errors.email}
          errorId="recovery-email-error"
        >
          <Input
            id="recovery-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "recovery-email-error" : undefined}
            hasError={!!errors.email}
            disabled={request.isPending}
            {...emailField}
            onChange={(event) => {
              emailField.onChange(event);
              clearErrors("email");
              setServerError(null);
            }}
          />
        </FormField>

        {serverError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive"
          >
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={request.isPending || cooldown.secondsLeft > 0}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-accent shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {request.isPending
            ? "Đang gửi mã..."
            : cooldown.secondsLeft > 0
              ? `Thử lại sau ${cooldown.secondsLeft}s`
              : "Gửi mã xác minh"}
          {!request.isPending && cooldown.secondsLeft === 0 && (
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
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
