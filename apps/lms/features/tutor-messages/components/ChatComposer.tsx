"use client";

import { memo, useState, type FormEvent, type KeyboardEvent } from "react";
import { PaperAirplaneIcon as Send } from "@heroicons/react/24/outline";

interface ChatComposerProps {
  sending: boolean;
  onSend: (content: string) => Promise<unknown>;
}

/** Owns the draft text so typing re-renders only this input, never the message list above it. */
export const ChatComposer = memo(function ChatComposer({ sending, onSend }: ChatComposerProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || sending) return;
    try {
      await onSend(text);
      setText("");
    } catch {
      // The hook exposes the API error below the message list.
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void handleSubmit(event as unknown as FormEvent);
    }
  };

  return (
    <div className="shrink-0 border-t border-border bg-card px-2 py-2 sm:px-4">
      <div className="relative mx-auto max-w-5xl">
        <form onSubmit={handleSubmit} className="flex items-end gap-1.5 rounded-2xl border border-input bg-background p-1.5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          <textarea
            id="chat-message-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn (Enter để gửi, Shift + Enter xuống dòng)"
            rows={1}
            className="block max-h-32 min-h-10 min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-2 py-2 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground [field-sizing:content]"
          />
          <button type="submit" disabled={!text.trim() || sending} aria-label="Gửi tin nhắn" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">
            <Send width={17} height={17} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
});
