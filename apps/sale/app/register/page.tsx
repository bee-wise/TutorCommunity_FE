import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: "Đăng ký | BeeWise",
  description:
    "Tạo tài khoản BeeWise miễn phí. Tham gia với tư cách học viên hoặc gia sư.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthLayout variant="register">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}

