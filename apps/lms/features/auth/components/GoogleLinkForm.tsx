"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { googleLinkSchema, type GoogleLinkRequest } from "@workspace/core/schemas/google-auth.schema";
import type { ApiError } from "@workspace/core/sys-libs/error-handler";
import { FormField, Input } from "./FormField";

export function GoogleLinkForm({ email, error, pending, passwordRecoveryUrl, onSubmit }: {
  email?: string | null;
  error: ApiError | null;
  pending: boolean;
  passwordRecoveryUrl: string;
  onSubmit: (values: GoogleLinkRequest) => void;
}) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<GoogleLinkRequest>({
    resolver: zodResolver(googleLinkSchema),
    defaultValues: { currentPassword: "" },
  });

  useEffect(() => {
    if (!error) return;
    if (error.code === "INVALID_CREDENTIALS") {
      setError("currentPassword", { type: "server", message: "Mật khẩu BeeWise không đúng" });
    }
    for (const field of ["currentPassword", "agreeLink"] as const) {
      const message = error.errors?.[field]?.[0];
      if (message) setError(field, { type: "server", message });
    }
  }, [error, setError]);

  return (
    <form onSubmit={(event) => { event.stopPropagation(); void handleSubmit(onSubmit)(event); }} className="space-y-3" noValidate>
      {email && <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">Tài khoản Google: <strong>{email}</strong></p>}
      {error && error.code !== "INVALID_CREDENTIALS" && <p role="alert" className="text-xs font-medium text-destructive">{error.message}</p>}
      <FormField label="Mật khẩu BeeWise hiện tại" htmlFor="google-link-password" error={errors.currentPassword}>
        <Input id="google-link-password" type="password" autoComplete="current-password" aria-label="Mật khẩu BeeWise hiện tại" hasError={!!errors.currentPassword} disabled={pending} {...register("currentPassword")} />
      </FormField>
      <label className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-2.5 text-xs text-foreground has-[:disabled]:cursor-not-allowed">
        <input type="checkbox" className="peer sr-only" disabled={pending} {...register("agreeLink")} />
        <span aria-hidden className="mt-px grid size-5 shrink-0 place-items-center rounded-md border-2 border-border bg-card text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50"><CheckIcon className="size-3.5" /></span>
        <span>Tôi đồng ý liên kết tài khoản Google này với tài khoản BeeWise của mình.</span>
      </label>
      {errors.agreeLink && <p className="text-xs text-destructive">{errors.agreeLink.message}</p>}
      <Button type="submit" disabled={pending} aria-busy={pending} className="min-h-11 w-full rounded-xl transition-all active:scale-[0.98]">{pending ? "Đang liên kết..." : "Liên kết tài khoản"}</Button>
      <p className="text-center text-xs text-muted-foreground">Quên mật khẩu? <a href={passwordRecoveryUrl} className="font-bold text-primary transition-colors hover:text-primary/80">Khôi phục mật khẩu</a>, rồi bắt đầu Google lại.</p>
    </form>
  );
}
