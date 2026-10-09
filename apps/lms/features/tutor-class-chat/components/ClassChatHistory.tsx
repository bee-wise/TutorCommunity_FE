import type { RefObject } from "react";
import type { ClassChatMessage } from "../types/class-chat.types";

const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });

export function ClassChatHistory({ messages, historyRef }: {
  messages: readonly ClassChatMessage[]; historyRef: RefObject<HTMLDivElement | null>;
}) {
  return <div ref={historyRef} role="log" aria-label="Tin nhắn của lớp" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6">
    {!messages.length && <p className="py-10 text-center text-sm text-muted-foreground">Chưa có tin nhắn. Bắt đầu trao đổi với học viên trong lớp.</p>}
    {messages.map((message) => <article key={message.id} className={`flex ${message.senderRole === "TUTOR" ? "justify-end" : "justify-start"}`}>
      <div className="w-fit min-w-0 max-w-[90%] space-y-1.5 sm:max-w-[75%]">
        <p className="text-xs font-bold text-muted-foreground">{message.senderRole === "TUTOR" ? "Bạn (Gia sư)" : message.senderName}</p>
        <p className={`whitespace-pre-wrap rounded-2xl border px-4 py-3 text-base leading-relaxed [overflow-wrap:anywhere] ${message.senderRole === "TUTOR" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>{message.content}</p>
        <time dateTime={message.createdAt} className="block text-xs text-muted-foreground">{formatter.format(new Date(message.createdAt))}</time>
      </div>
    </article>)}
  </div>;
}
