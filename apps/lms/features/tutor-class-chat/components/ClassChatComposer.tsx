"use client";

import type { UseFormReturn } from "react-hook-form";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ClassChatMessageInput } from "../schemas/class-chat.schema";

export function ClassChatComposer({ form, sending, onSubmit }: {
  form: UseFormReturn<ClassChatMessageInput>; sending: boolean; onSubmit: () => Promise<void>;
}) {
  const error = form.formState.errors.content?.message ?? form.formState.errors.root?.message;
  return <form onSubmit={onSubmit} className="shrink-0 border-t border-border bg-card px-3 py-3 sm:px-5" aria-label="Gửi tin nhắn lớp" aria-busy={sending}>
    <div className="mx-auto max-w-4xl rounded-2xl border border-input bg-background p-2 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      <label htmlFor="class-chat-content" className="sr-only">Tin nhắn cho cả lớp</label>
      <textarea id="class-chat-content" rows={1} maxLength={2000} {...form.register("content")} disabled={sending}
        placeholder="Nhập tin nhắn cho cả lớp…" aria-invalid={Boolean(error)} aria-describedby="class-chat-help"
        className="block max-h-32 min-h-11 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground [field-sizing:content] disabled:opacity-60"
        onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!sending) void onSubmit(); } }} />
      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-2">
        <p id="class-chat-help" className={`text-[11px] ${error ? "text-destructive" : "text-muted-foreground"}`} role={error ? "alert" : undefined}>{error ?? "Enter để gửi · Shift + Enter xuống dòng. Tin nhắn mock chỉ lưu đến khi tải lại trang."}</p>
        <Button type="submit" size="icon" disabled={sending} aria-label={sending ? "Đang gửi tin nhắn" : "Gửi tin nhắn"} className="size-11 shrink-0 rounded-lg transition-all active:scale-[0.98]"><PaperAirplaneIcon className="size-4" aria-hidden="true" /></Button>
      </div>
    </div>
  </form>;
}
