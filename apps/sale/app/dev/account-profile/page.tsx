import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { MeType } from "@workspace/core/types/auth.type";
import { AccountProfileView } from "@/features/account-profile/components/AccountProfileView";

export const metadata: Metadata = { title: "Preview hồ sơ tài khoản", robots: { index: false, follow: false } };

const previewUser: MeType = {
  id: "account-profile-preview", email: "linh.nguyen@example.test", firstName: "Linh", lastName: "Nguyễn", fullName: "Nguyễn Linh", phoneNumber: "0912345678", role: "LEARNER", status: "ACTIVE", permissions: [],
};

export default function AccountProfilePreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main><AccountProfileView user={previewUser} /></main>;
}
