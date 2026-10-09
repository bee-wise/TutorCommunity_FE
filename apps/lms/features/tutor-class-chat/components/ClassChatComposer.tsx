"use client";

import type { UseFormReturn } from "react-hook-form";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ClassChatMessageInput } from "../schemas/class-chat.schema";

export function ClassChatComposer({ form, sending, onSubmit }: {
  form: UseFormReturn<ClassChatMessageInput>; sending: boolean; onSubmit: () => Promise<void>;
}) {
  const error = form.formState.errors.content?.message ?? form.formState.errors.root?.message;
  return <form onSubmit={onSubmit} className="shrink-0 space-y-2 border-t border-border bg-card p-4" aria-label="Gửi tin nhắn lớp" aria-busy={sending}>
    <label htmlFor="class-chat-content" className="block text-xs font-bold text-foreground">Tin nhắn cho cả lớp</label>
    <div className="flex items-end gap-3">
      <textarea id="class-chat-content" rows={2} maxLength={2000} {...form.register("content")} disabled={sending}
        placeholder="Nhập nội dung trao đổi…" aria-invalid={Boolean(error)} aria-describedby="class-chat-help"
        className="min-h-16 min-w-0 flex-1 resize-none rounded-2xl border border-input bg-card px-3.5 py-2.5 text-base outline-none transition-all placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!sending) void onSubmit(); } }} />
      <Button type="submit" disabled={sending} className="min-h-11 shrink-0 rounded-xl px-4 font-bold transition-all active:scale-[0.98] motion-reduce:transform-none"><PaperAirplaneIcon className="size-4" aria-hidden="true" /><span>{sending ? "Đang gửi…" : "Gửi"}</span></Button>
    </div>
    <p id="class-chat-help" className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`} role={error ? "alert" : undefined}>{error ?? "Enter để gửi, Shift + Enter để xuống dòng. Tin nhắn mock chỉ lưu đến khi tải lại trang."}</p>
  </form>;
}
