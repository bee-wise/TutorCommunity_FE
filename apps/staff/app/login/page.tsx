import type { Metadata } from "next";
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: "Đăng nhập Staff | BeeWise",
  description: "Đăng nhập dành cho Admin và Consultant của BeeWise.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
