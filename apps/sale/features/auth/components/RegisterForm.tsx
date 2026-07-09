"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeSlash,
  ArrowRight,
  Student,
  ChalkboardTeacher,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { FormField, Input } from "./FormField";

const ROLES = [
  {
    value: "learner" as const,
    label: "HỌC VIÊN",
    icon: Student,
  },
  {
    value: "tutor" as const,
    label: "GIA SƯ",
    icon: ChalkboardTeacher,
  },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeTerms: false },
  });

  const selectedRole = watch("role");
  const agreeTerms = watch("agreeTerms");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // TODO: gọi API đăng ký
    console.log("Register data:", data);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    
    // Sau khi đăng ký thành công, chuyển hướng về trang Đăng nhập của Sale
    router.push("/login");
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-2xl tracking-tight text-foreground mb-1"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
        >
          Tạo tài khoản BEEWISE
        </h1>
        <p className="text-xs text-foreground/60 leading-relaxed">
          Tham gia BeeWise - nền tảng kết nối gia sư và học viên thông minh.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold text-foreground/80"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Bạn muốn trở thành
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ROLES.map(({ value, label, icon: Icon }) => {
              const isSelected = selectedRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setValue("role", value, { shouldValidate: true })
                  }
                  className={`relative flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={18}
                      weight={isSelected ? "fill" : "regular"}
                      className={
                        isSelected ? "text-primary" : "text-foreground/50"
                      }
                    />
                    <span
                      className={`text-[10px] font-bold leading-tight ${isSelected ? "text-primary" : "text-foreground/70"}`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span aria-hidden="true">✕</span>
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Họ" error={errors.firstName}>
            <Input
              id="register-firstName"
              type="text"
              placeholder="Nguyễn"
              autoComplete="given-name"
              hasError={!!errors.firstName}
              {...register("firstName")}
            />
          </FormField>
          <FormField label="Tên" error={errors.lastName}>
            <Input
              id="register-lastName"
              type="text"
              placeholder="Văn A"
              autoComplete="family-name"
              hasError={!!errors.lastName}
              {...register("lastName")}
            />
          </FormField>
        </div>

        <FormField label="Email" error={errors.email}>
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            hasError={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Mật khẩu" error={errors.password}>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                autoComplete="new-password"
                hasError={!!errors.password}
                className="pr-11"
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

          <FormField label="Xác nhận mật khẩu" error={errors.confirmPassword}>
            <div className="relative">
              <Input
                id="register-confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                hasError={!!errors.confirmPassword}
                className="pr-11"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() =>
                setValue("agreeTerms", !agreeTerms, { shouldValidate: true })
              }
              className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 cursor-pointer
                ${
                  agreeTerms
                    ? "bg-primary border-primary"
                    : "border-border group-hover:border-primary/50 bg-background"
                }`}
            >
              {agreeTerms && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4.5L4 7.5L10 1.5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              {...register("agreeTerms")}
            />
            <span className="text-xs text-foreground/60 leading-relaxed">
              Tôi đồng ý với{" "}
              <Link
                href="/terms"
                className="text-primary font-semibold hover:underline"
              >
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="text-primary font-semibold hover:underline"
              >
                Chính sách bảo mật
              </Link>{" "}
              của BeeWise.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span aria-hidden="true">✕</span>
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          id="register-submit"
          type="submit"
          disabled={isLoading}
          className="relative w-full h-10 rounded-xl bg-accent text-primary font-bold text-sm
            flex items-center justify-center gap-2
            hover:bg-accent/90 active:scale-[0.98] transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {isLoading ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>Tạo tài khoản</>
          )}
        </button>
        {/* Divider */}
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-background text-xs text-foreground/40">
              hoặc đăng ký bằng
            </span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
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
          <button
            type="button"
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-border bg-background text-sm font-semibold text-foreground/80 hover:bg-muted transition-colors"
          >
            <Image
              src="/images/Logos/facebook.png"
              alt="Facebook"
              width={20}
              height={20}
              className="object-contain"
            />
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-foreground/60 mt-1">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
