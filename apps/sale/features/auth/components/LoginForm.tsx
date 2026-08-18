"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useLogin } from "@workspace/core/hooks/useLogin";
import { getSafeInternalReturnUrl } from "@workspace/core/utils/auth-redirect";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { FormField, Input } from "./FormField";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnUrl = getSafeInternalReturnUrl(
    searchParams.get("returnUrl") || searchParams.get("redirect"),
  );
  const prefilledEmail = searchParams.get("email") ?? "";
  const { mutate: login, isPending } = useLogin({
    redirectUrl: returnUrl ?? undefined,
    loginScreen: "SALE",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail,
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (isPending) return;
    login(data);
  };

  const registerHref = returnUrl
    ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/register";

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="mb-6">
        <h1
          className="font-nunito mb-1 text-2xl font-extrabold tracking-tight text-foreground"
        >
          Chào mừng trở lại
        </h1>
        <p className="text-xs text-foreground/60 leading-relaxed">
          Đăng nhập để tiếp tục hành trình học tập cùng BeeWise.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField label="Email" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            hasError={!!errors.email}
            disabled={isPending}
            {...register("email")}
          />
        </FormField>

        <FormField label="Mật khẩu" error={errors.password}>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              hasError={!!errors.password}
              className="pr-11"
              disabled={isPending}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={isPending}
          className="relative w-full h-10 rounded-xl bg-accent text-primary font-bold text-sm
            flex items-center justify-center gap-2
            hover:bg-accent/90 active:scale-[0.98] transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          {isPending ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>Đăng nhập</>
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-background text-xs text-foreground/40">
              hoặc tiếp tục với
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 h-10 rounded-xl border border-border bg-background text-sm font-semibold text-foreground/80 hover:bg-muted transition-colors"
        >
          <Image
            src="/images/Logos/google.png"
            alt="Google"
            width={20}
            height={20}
            className="object-contain"
          />
          Google
        </button>

        <p className="text-center text-sm text-foreground/60 mt-2">
          Chưa có tài khoản?{" "}
          <Link
            href={registerHref}
            className="font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
