import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { getPublicAuthStatus } from '@/features/auth/lib/public-auth-status';

export const metadata: Metadata = {
  title: "Đăng nhập | BeeWise",
  description: "Đăng nhập vào BeeWise để tiếp tục hành trình học tập cùng gia sư phù hợp.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const authStatus = getPublicAuthStatus((await headers()).get("host"));

  return (
    <AuthLayout variant="login" authPaused={authStatus.paused} notice={authStatus.notice}>
      <Suspense fallback={null}>
        <LoginForm authPaused={authStatus.paused} />
      </Suspense>
    </AuthLayout>
  );
}

