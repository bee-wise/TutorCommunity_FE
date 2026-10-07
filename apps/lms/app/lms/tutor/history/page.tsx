import type { Metadata } from "next";
import { ConnectionHistoryScreen } from "@/features/tutor-history/components/ConnectionHistoryScreen";

export const metadata: Metadata = { title: "Lịch sử kết nối | BeeWise LMS", description: "Theo dõi kết nối với học viên và xem lại cuộc trò chuyện." };
export default function Page() { return <ConnectionHistoryScreen />; }
