import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { ChangePasswordScreen } from "@/features/auth/components/ChangePasswordScreen";

export const metadata: Metadata = {
  title: "Đổi mật khẩu | BeeWise",
  description: "Đổi mật khẩu tài khoản BeeWise của bạn.",
  robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center bg-muted px-4 pb-12 pt-24 sm:pt-28">
        <ChangePasswordScreen />
      </main>
      <Footer />
    </div>
  );
}
