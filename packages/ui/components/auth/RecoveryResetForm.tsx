"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, KeyIcon } from "@heroicons/react/24/outline";
import { resetPasswordSchema, type ResetPasswordValues } from "@workspace/core/schemas/password.schema";
import type { ResetPasswordRequest } from "@workspace/core/types/auth.type";
import { Button } from "../ui/button";
import { OtpInput } from "./RecoveryOtpInput";
import { RecoveryField } from "./RecoveryField";
import { RecoveryPasswordInput } from "./RecoveryPasswordInput";

export function RecoveryResetForm({
  email,
  pending,
  resendPending,
  sendCooldownSeconds,
  verifyCooldownSeconds,
  feedback,
  onChangeEmail,
  onResend,
  onReset,
}: {
  email: string;
  pending: boolean;
  resendPending: boolean;
  sendCooldownSeconds: number;
  verifyCooldownSeconds: number;
  feedback: { kind: "error" | "info"; text: string } | null;
  onChangeEmail: () => void;
  onResend: () => Promise<boolean | undefined>;
  onReset: (values: Omit<ResetPasswordRequest, "email">) => Promise<void>;
}) {
  const { control, register, handleSubmit, resetField, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: "", newPassword: "", confirmPassword: "" },
  });

  const resend = async () => {
    const sent = await onResend();
    if (sent) resetField("otp");
  };

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <span className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl bg-accent/20 text-primary" aria-hidden="true">
        <KeyIcon className="size-6" />
      </span>
      <h1 className="font-nunito text-2xl font-extrabold tracking-tight text-foreground">Đặt lại mật khẩu</h1>
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Nhập mã 6 chữ số đã gửi tới email của bạn để tiếp tục.</p>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground">Mã xác minh gửi tới</p>
          <p className="truncate text-xs font-bold text-foreground">{email}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onChangeEmail} className="h-8 rounded-lg text-xs font-bold transition-all active:scale-95">
          <ArrowLeftIcon className="size-4" aria-hidden="true" /> Đổi email
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(({ otp, newPassword, confirmPassword }) => onReset({ otp, newPassword, confirmPassword }))}
        noValidate
        className="mt-4 space-y-3"
      >
        <RecoveryField label="Mã xác minh" htmlFor="recovery-otp-0" error={errors.otp?.message} errorId="recovery-otp-error">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OtpInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} disabled={pending} hasError={!!errors.otp} errorId="recovery-otp-error" hintId="recovery-otp-hint" />
            )}
          />
        </RecoveryField>
        <p id="recovery-otp-hint" className="text-xs leading-5 text-muted-foreground">Mã có hiệu lực 10 phút và chỉ dùng một lần.</p>

        <RecoveryField label="Mật khẩu mới" htmlFor="recovery-new-password" error={errors.newPassword?.message} errorId="recovery-new-password-error">
          <RecoveryPasswordInput
            id="recovery-new-password"
            autoComplete="new-password"
            placeholder="8–128 ký tự"
            aria-invalid={!!errors.newPassword}
            aria-describedby={errors.newPassword ? "recovery-new-password-error" : undefined}
            disabled={pending}
            {...register("newPassword")}
          />
        </RecoveryField>

        <RecoveryField label="Xác nhận mật khẩu mới" htmlFor="recovery-confirm-password" error={errors.confirmPassword?.message} errorId="recovery-confirm-password-error">
          <RecoveryPasswordInput
            id="recovery-confirm-password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "recovery-confirm-password-error" : undefined}
            disabled={pending}
            {...register("confirmPassword")}
          />
        </RecoveryField>

        {feedback && (
          <p role={feedback.kind === "error" ? "alert" : "status"} className={`rounded-xl border px-3 py-2 text-xs leading-5 ${feedback.kind === "error" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-primary/15 bg-muted text-primary"}`}>
            {feedback.text}
          </p>
        )}

        <Button type="submit" disabled={pending || verifyCooldownSeconds > 0} className="h-10 w-full rounded-xl bg-primary font-extrabold text-primary-foreground transition-all active:scale-[0.98]">
          {pending ? "Đang xác minh..." : verifyCooldownSeconds > 0 ? `Thử lại sau ${verifyCooldownSeconds}s` : "Đặt lại mật khẩu"}
          {!pending && verifyCooldownSeconds === 0 && <ArrowRightIcon className="size-4" aria-hidden="true" />}
        </Button>
      </form>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span>Chưa nhận được mã?</span>
        <Button type="button" variant="outline" size="sm" onClick={() => { void resend(); }} disabled={resendPending || sendCooldownSeconds > 0} className="h-8 rounded-lg text-xs font-bold transition-all active:scale-95">
          {resendPending ? "Đang gửi..." : sendCooldownSeconds > 0 ? `Gửi lại sau ${sendCooldownSeconds}s` : "Gửi mã mới"}
        </Button>
      </div>
    </div>
  );
}
