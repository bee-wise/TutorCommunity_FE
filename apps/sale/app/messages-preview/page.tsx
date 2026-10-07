import type { Metadata } from "next";
import { TVCChatDemoScreen } from "@/features/messages";

export const metadata: Metadata = {
  title: "Tin nhắn | BeeWise",
  description: "Trò chuyện và kết nối cùng Gia sư và Tư vấn viên BeeWise.",
};

export default function MessagesPreviewPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-muted p-3 sm:p-4 text-foreground">
      <main className="flex-1 overflow-hidden">
        <TVCChatDemoScreen />
      </main>
    </div>
  );
}
