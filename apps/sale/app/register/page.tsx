import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { getPublicAuthStatus } from '@/features/auth/lib/public-auth-status';

export const metadata: Metadata = {
  title: "Đăng ký | BeeWise",
  description:
    "Tạo tài khoản BeeWise miễn phí. Tham gia với tư cách học viên hoặc gia sư.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const authStatus = getPublicAuthStatus((await headers()).get("host"));

  return (
    <AuthLayout variant="register" authPaused={authStatus.paused} notice={authStatus.notice}>
      <Suspense fallback={null}>
        <RegisterForm authPaused={authStatus.paused} />
      </Suspense>
    </AuthLayout>
  );
}

