import type { Metadata } from "next";
import { OwnProfileScreen } from "@/features/tutor-profile/components/OwnProfileScreen";

export const metadata: Metadata = { title: "Hồ sơ của tôi | BeeWise LMS", description: "Xem hồ sơ giảng dạy và thông tin tài khoản gia sư." };
export default function Page() { return <OwnProfileScreen />; }
