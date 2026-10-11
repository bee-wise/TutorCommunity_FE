import type { Metadata } from "next";
import { Suspense } from "react";
import { PasswordRecoveryFlow } from "@/features/auth/components/PasswordRecoveryFlow";

export const metadata: Metadata = {
  title: "Quên mật khẩu LMS | BeeWise",
  description: "Xác minh qua email để đặt lại mật khẩu BeeWise LMS.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PasswordRecoveryFlow />
    </Suspense>
  );
}
