"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage, handleApiError } from "@workspace/core/sys-libs/error-handler";
import { useChangePassword } from "../hooks/usePasswordActions";
import { changePasswordSchema, type ChangePasswordValues } from "../schemas/password.schema";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const changePassword = useChangePassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (changePassword.isPending) return;
    setServerError(null);
    try {
      await changePassword.mutateAsync(values);
    } catch (error) {
      const apiError = handleApiError(error);
      setServerError(
        apiError.statusCode === 429 && apiError.retryAfterSeconds
          ? `Thao tác quá thường xuyên. Vui lòng thử lại sau ${apiError.retryAfterSeconds} giây.`
          : getApiErrorMessage(error, "Không thể đổi mật khẩu. Vui lòng thử lại."),
      );
    }
  });

  return (
    <section className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8" aria-labelledby="change-password-heading">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-primary" aria-hidden="true">
        <ShieldCheck size={26} weight="duotone" />
      </span>
      <h1 id="change-password-heading" className="font-nunito text-2xl font-extrabold tracking-tight text-foreground">Đổi mật khẩu</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Nhập mật khẩu hiện tại và tạo mật khẩu mới. Sau khi đổi, bạn sẽ cần đăng nhập lại.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="Mật khẩu hiện tại" htmlFor="current-password" error={errors.currentPassword} errorId="current-password-error">
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            placeholder="Mật khẩu đang sử dụng"
            aria-invalid={!!errors.currentPassword}
            aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
            hasError={!!errors.currentPassword}
            disabled={changePassword.isPending}
            {...register("currentPassword")}
          />
        </FormField>

        <FormField label="Mật khẩu mới" htmlFor="change-new-password" error={errors.newPassword} errorId="change-new-password-error">
          <PasswordInput
            id="change-new-password"
            autoComplete="new-password"
            placeholder="8–128 ký tự"
            aria-invalid={!!errors.newPassword}
            aria-describedby={errors.newPassword ? "change-new-password-error" : undefined}
            hasError={!!errors.newPassword}
            disabled={changePassword.isPending}
            {...register("newPassword")}
          />
        </FormField>

        <FormField label="Xác nhận mật khẩu mới" htmlFor="change-confirm-password" error={errors.confirmPassword} errorId="change-confirm-password-error">
          <PasswordInput
            id="change-confirm-password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "change-confirm-password-error" : undefined}
            hasError={!!errors.confirmPassword}
            disabled={changePassword.isPending}
            {...register("confirmPassword")}
          />
        </FormField>

        {serverError && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">{serverError}</p>}

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-primary shadow-md shadow-accent/20 transition-colors hover:bg-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {changePassword.isPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </section>
  );
}
