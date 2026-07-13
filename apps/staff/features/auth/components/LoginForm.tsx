"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { FormField, Input } from "./FormField";
import { useLogin } from "@workspace/core/hooks/useLogin";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin({ role: "STAFF" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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
        <div className="flex justify-center mb-4 bg-accent rounded-full w-fit m-auto">
          <Image
            src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
            alt="BeeWise Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-2 text-center">
          <h1
            className="text-2xl tracking-tight text-[#0c0c0b] mb-1"
            style={{ fontFamily: "var(--font-google-sans)", fontWeight: 800 }}
          >
            Đăng nhập vào BeeWise Staff
          </h1>
          <p className="text-xs text-[#0c0c0b]/60 leading-relaxed max-w-[280px] mx-auto">
            Dành cho Admin và Consultant của BeeWise
          </p>
        </div>

        <FormField label="Email" error={errors.email}>
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

        <FormField label="Mật khẩu" error={errors.password}>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0c0c0b]/40 hover:text-[#0c0c0b]/70 transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[#280f91] hover:text-[#280f91]/80 font-semibold transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* CTA */}
        <button
          id="login-submit"
          type="submit"
          disabled={isPending}
          className="relative w-full h-12 mt-2 rounded-xl bg-[#280f91] text-white font-bold text-sm
            flex items-center justify-center gap-2
            hover:bg-[#1f0c73] active:scale-[0.98] transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#280f91]/30"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {isPending ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>Đăng nhập</>
          )}
        </button>
      </form>
    </div>
  );
}
