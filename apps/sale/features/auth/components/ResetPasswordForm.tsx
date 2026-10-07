"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Key, ArrowRight } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import {
  getApiErrorMessage,
  handleApiError,
} from "@workspace/core/sys-libs/error-handler";
import { useCooldown } from "../hooks/useCooldown";
import {
  useForgotPassword,
  useResetPassword,
} from "../hooks/usePasswordActions";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../schemas/password.schema";
import { FormField } from "./FormField";
import { OtpInput } from "./OtpInput";
import { PasswordInput } from "./PasswordInput";

interface ResetPasswordFormProps {
  email: string;
  onChangeEmail: () => void;
}

export function ResetPasswordForm({
  email,
  onChangeEmail,
}: ResetPasswordFormProps) {
  const [feedback, setFeedback] = useState<{
    kind: "error" | "info";
    text: string;
  } | null>(null);
  const sendCooldown = useCooldown(60);
  const verifyCooldown = useCooldown();
  const resend = useForgotPassword();
  const reset = useResetPassword();
  const {
    control,
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: "", newPassword: "", confirmPassword: "" },
  });

  const onResend = async () => {
    if (resend.isPending || sendCooldown.secondsLeft > 0) return;
    setFeedback(null);
    try {
      await resend.mutateAsync({ email });
      resetField("otp");
      sendCooldown.start(60);
      setFeedback({
        kind: "info",
        text: "Nếu email đã đăng ký, mã mới sẽ được gửi. Mã trước đó không còn hiệu lực.",
      });
    } catch (error) {
      const apiError = handleApiError(error);
      if (apiError.statusCode === 429)
        sendCooldown.start(apiError.retryAfterSeconds ?? 60);
      setFeedback({
        kind: "error",
        text: getApiErrorMessage(error, "Không thể gửi lại mã."),
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (reset.isPending || verifyCooldown.secondsLeft > 0) return;
    setFeedback(null);
    try {
      await reset.mutateAsync(values);
    } catch (error) {
      const apiError = handleApiError(error);
      if (apiError.statusCode === 429)
        verifyCooldown.start(apiError.retryAfterSeconds ?? 60);
      setFeedback({
        kind: "error",
        text: getApiErrorMessage(error, "Không thể đặt lại mật khẩu."),
      });
    }
  });

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <span
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-primary"
        aria-hidden="true"
      >
        <Key size={23} weight="duotone" />
      </span>
      <h1 className="font-nunito text-2xl font-extrabold tracking-tight text-foreground">
        Đặt lại mật khẩu
      </h1>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Nhập mã 6 chữ số đã được gửi đến địa chỉ email của bạn để tiếp tục.
      </p>

      <div className="mt-3.5 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/40 px-3.5 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            Mã xác minh gửi tới
          </p>
          <p className="truncate text-xs font-bold text-foreground">{email}</p>
        </div>
        <button
          type="button"
          onClick={onChangeEmail}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground/80 shadow-2xs transition-all hover:bg-muted hover:text-foreground active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={13} weight="bold" aria-hidden="true" />
          <span>Đổi email</span>
        </button>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3.5">
        <FormField
          label="Mã xác minh"
          htmlFor="recovery-otp-0"
          error={errors.otp}
          errorId="recovery-otp-error"
        >
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                disabled={reset.isPending}
                hasError={!!errors.otp}
                errorId="recovery-otp-error"
                hintId="recovery-otp-hint"
              />
            )}
          />
        </FormField>
        <p
          id="recovery-otp-hint"
          className="text-xs leading-5 text-muted-foreground"
        >
          Mã có hiệu lực 10 phút và chỉ dùng một lần.
        </p>

        <FormField
          label="Mật khẩu mới"
          htmlFor="recovery-new-password"
          error={errors.newPassword}
          errorId="recovery-new-password-error"
        >
          <PasswordInput
            id="recovery-new-password"
            autoComplete="new-password"
            placeholder="8–128 ký tự"
            aria-invalid={!!errors.newPassword}
            aria-describedby={
              errors.newPassword ? "recovery-new-password-error" : undefined
            }
            hasError={!!errors.newPassword}
            disabled={reset.isPending}
            {...register("newPassword")}
          />
        </FormField>

        <FormField
          label="Xác nhận mật khẩu mới"
          htmlFor="recovery-confirm-password"
          error={errors.confirmPassword}
          errorId="recovery-confirm-password-error"
        >
          <PasswordInput
            id="recovery-confirm-password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword
                ? "recovery-confirm-password-error"
                : undefined
            }
            hasError={!!errors.confirmPassword}
            disabled={reset.isPending}
            {...register("confirmPassword")}
          />
        </FormField>

        {feedback && (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={`rounded-xl border px-3 py-2 text-xs leading-5 ${feedback.kind === "error" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-primary/15 bg-muted text-primary"}`}
          >
            {feedback.text}
          </p>
        )}

        <button
          type="submit"
          disabled={reset.isPending || verifyCooldown.secondsLeft > 0}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-primary shadow-md shadow-accent/20 transition-colors hover:bg-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {reset.isPending
            ? "Đang xác minh..."
            : verifyCooldown.secondsLeft > 0
              ? `Thử lại sau ${verifyCooldown.secondsLeft}s`
              : "Đặt lại mật khẩu"}
          {!reset.isPending && verifyCooldown.secondsLeft === 0 && (
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          )}
        </button>
      </form>

      <div className="mt-4 border-t border-border pt-3 text-center text-xs text-muted-foreground">
        Chưa nhận được mã?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={resend.isPending || sendCooldown.secondsLeft > 0}
          className="font-bold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground cursor-pointer"
        >
          {resend.isPending
            ? "Đang gửi..."
            : sendCooldown.secondsLeft > 0
              ? `Gửi lại sau ${sendCooldown.secondsLeft}s`
              : "Gửi mã mới"}
        </button>
      </div>
    </div>
  );
}
