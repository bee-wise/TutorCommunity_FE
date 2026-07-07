import type { Metadata } from "next";
import { AuthLayout } from "@/src/features/auth/components/AuthLayout";
import { LoginForm } from "@/src/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | BeeWise",
  description: "Đăng nhập vào BeeWise để tiếp tục hành trình học tập cùng gia sư phù hợp.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
