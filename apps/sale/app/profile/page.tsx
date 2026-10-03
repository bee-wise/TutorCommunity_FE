import type { Metadata } from "next";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { Header } from "@workspace/ui/components/layout/Header";
import { AccountProfileScreen } from "@/features/account-profile/components/AccountProfileScreen";

export const metadata: Metadata = {
  title: "Hồ sơ tài khoản",
  description: "Thông tin cá nhân và tùy chọn tài khoản BeeWise của bạn.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <AccountProfileScreen />
      </main>
      <Footer />
    </div>
  );
}
