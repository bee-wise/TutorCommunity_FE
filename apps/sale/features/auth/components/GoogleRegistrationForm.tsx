"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcademicCapIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { googleRegistrationSchema, type GoogleRegistrationRequest } from "@workspace/core/schemas/google-auth.schema";
import type { ApiError } from "@workspace/core/sys-libs/error-handler";
import { FormField, Input } from "./FormField";

export function GoogleRegistrationForm({
  email,
  firstName,
  lastName,
  error,
  pending,
  onSubmit,
}: {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  error: ApiError | null;
  pending: boolean;
  onSubmit: (values: GoogleRegistrationRequest) => void;
}) {
  const { register, handleSubmit, control, setValue, setError, formState: { errors } } = useForm<GoogleRegistrationRequest>({
    resolver: zodResolver(googleRegistrationSchema),
    defaultValues: { firstName: firstName ?? "", lastName: lastName ?? "", phoneNumber: "" },
  });
  const role = useWatch({ control, name: "role" });

  useEffect(() => {
    if (!error?.errors) return;
    for (const field of ["firstName", "lastName", "phoneNumber", "role", "agreeTerms"] as const) {
      const message = error.errors[field]?.[0];
      if (message) setError(field, { type: "server", message });
    }
  }, [error, setError]);

  return (
    <form onSubmit={(event) => { event.stopPropagation(); void handleSubmit(onSubmit)(event); }} className="space-y-3" noValidate>
      {email && <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">Email Google: <strong>{email}</strong></p>}
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error.message}</p>}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Họ" error={errors.lastName} htmlFor="google-last-name">
          <Input id="google-last-name" autoComplete="family-name" hasError={!!errors.lastName} disabled={pending} {...register("lastName")} />
        </FormField>
        <FormField label="Tên" error={errors.firstName} htmlFor="google-first-name">
          <Input id="google-first-name" autoComplete="given-name" hasError={!!errors.firstName} disabled={pending} {...register("firstName")} />
        </FormField>
      </div>
      <FormField label="Số điện thoại" error={errors.phoneNumber} htmlFor="google-phone">
        <Input id="google-phone" type="tel" inputMode="tel" autoComplete="tel" hasError={!!errors.phoneNumber} disabled={pending} {...register("phoneNumber")} />
      </FormField>
      <fieldset className="space-y-1.5">
        <legend className="text-xs font-semibold text-foreground">Vai trò của bạn</legend>
        <div className="grid grid-cols-2 gap-2">
          {([{"value":"LEARNER" as const,"label":"Học viên","Icon":UserIcon},{"value":"TUTOR" as const,"label":"Gia sư","Icon":AcademicCapIcon}]).map(({ value, label, Icon }) => (
            <button key={value} type="button" disabled={pending} aria-pressed={role === value} onClick={() => setValue("role", value, { shouldValidate: true })}
              className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-bold transition-all active:scale-[0.98] ${role === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary"}`}>
              <Icon className="size-4" />{label}
            </button>
          ))}
        </div>
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </fieldset>
      <label className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-2.5 text-xs text-foreground">
        <input type="checkbox" className="mt-0.5 size-4 accent-primary" disabled={pending} {...register("agreeTerms")} />
        <span>Tôi đồng ý với <Link href="/terms" target="_blank" className="font-bold text-primary transition-colors hover:text-primary/80">Điều khoản</Link> và <Link href="/privacy" target="_blank" className="font-bold text-primary transition-colors hover:text-primary/80">Chính sách bảo mật</Link>.</span>
      </label>
      {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms.message}</p>}
      <Button type="submit" disabled={pending} className="h-10 w-full rounded-xl transition-all active:scale-[0.98]">{pending ? "Đang tạo tài khoản..." : "Hoàn tất đăng ký"}</Button>
    </form>
  );
}
