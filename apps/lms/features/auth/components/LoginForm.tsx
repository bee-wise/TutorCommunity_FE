"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowPathIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { FormField, Input } from "./FormField";
import { useLmsAccessActivation } from "./AuthLayout";
import { useLogin } from "@workspace/core/hooks/useLogin";
import { GoogleAuthEntry } from "./GoogleAuthEntry";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const openAccessActivationDialog = useLmsAccessActivation();
  const { mutate: login, isPending } = useLogin({
    redirectUrl: "/lms",
    loginScreen: "LMS",
    onLmsAccessNotActivated: openAccessActivationDialog,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) setValue("email", email);
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <div className="flex items-center justify-center mb-4 bg-accent rounded-full w-20 h-20 mx-auto">
          <Image
            src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789964842/Logo_1.png"
            alt="BeeWise Logo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-2 text-center">
          <h1
            className="text-2xl tracking-tight text-primary mb-1"
            style={{ fontFamily: "var(--font-google-sans)", fontWeight: 800 }}
          >
            Đăng nhập vào BeeWise LMS
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            Vui lòng đăng nhập bằng Email bạn đã đăng ký tại Cộng Đồng Gia Sư
            BeeWise
          </p>
        </div>

        <FormField label="Email" htmlFor="login-email" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            placeholder="you@beewise.edu.vn"
            autoComplete="email"
            hasError={!!errors.email}
            className="h-11"
            {...register("email")}
          />
        </FormField>

        <FormField label="Mật khẩu" htmlFor="login-password" error={errors.password}>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              hasError={!!errors.password}
              className="pr-11 h-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-primary"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeSlashIcon className="size-5" aria-hidden /> : <EyeIcon className="size-5" aria-hidden />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="inline-flex min-h-11 items-center px-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* CTA */}
        <Button
          id="login-submit"
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="mx-auto mt-2 min-h-11 w-full max-w-[400px] rounded-xl font-bold active:scale-[0.98]"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          {isPending && <ArrowPathIcon className="size-4 animate-spin" aria-hidden />}
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-medium">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <GoogleAuthEntry onLmsAccessNotActivated={openAccessActivationDialog} />
      </form>
    </div>
  );
}
