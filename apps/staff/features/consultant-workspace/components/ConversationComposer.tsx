"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ChevronDownIcon as CaretDown,
  PencilSquareIcon as NotePencil,
  PaperAirplaneIcon as PaperPlaneRight,
  SparklesIcon as Sparkle,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { messageTemplates } from "../data/workspace-options";

export function ConversationComposer({
  draft,
  onDraftChange,
  onSend,
  onOpenWidgets,
  sending,
  isMock,
  error,
}: {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onOpenWidgets: () => void;
  sending: boolean;
  isMock: boolean;
  error: string | null;
}) {
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  }, [draft]);

  function submit() {
    setShowTemplates(false);
    onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="relative shrink-0 border-t border-border bg-card px-3 py-3 sm:px-5">
      <div className="relative mx-auto max-w-4xl">
        {showTemplates && (
          <div
            id="consultant-message-templates"
            role="region"
            aria-label="Tin nhắn mẫu"
            className="absolute inset-x-0 bottom-full z-20 mb-2 max-h-[50dvh] overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-soft sm:inset-x-auto sm:right-0 sm:w-[420px]"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <strong className="font-nunito text-sm font-extrabold text-foreground">Tin nhắn mẫu</strong>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTemplates(false)}
                className="h-8 rounded-lg px-2.5 text-xs transition-all active:scale-95"
              >
                Đóng
              </Button>
            </div>
            <div className="space-y-1.5">
              {messageTemplates.map((template) => (
                <Button
                  type="button"
                  variant="outline"
                  key={template.id}
                  onClick={() => {
                    onDraftChange(template.content);
                    setShowTemplates(false);
                    textareaRef.current?.focus();
                  }}
                  className="h-auto w-full justify-between gap-3 whitespace-normal rounded-xl border-border bg-background px-3 py-2 text-left shadow-none transition-all hover:border-primary/40 hover:bg-muted active:scale-[0.98]"
                >
                  <span className="min-w-0">
                    <strong className="block text-xs font-bold text-foreground">{template.title}</strong>
                    <span className="block truncate text-[11px] text-muted-foreground">{template.description}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-bold text-primary">Dùng mẫu</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-input bg-background p-2 shadow-soft transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-ring/20 sm:flex-row sm:items-center sm:gap-2"
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Nội dung tin nhắn</span>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Soạn tin nhắn..."
              aria-describedby="consultant-composer-hint"
              className="block max-h-28 min-h-10 w-full resize-none overflow-y-auto bg-transparent px-2.5 py-2.5 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <span id="consultant-composer-hint" className="sr-only">
            Nhấn Enter để gửi, Shift+Enter để xuống dòng.
          </span>
          <div className="flex w-full items-center justify-between gap-1.5 border-t border-border pt-2 sm:w-auto sm:shrink-0 sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTemplates((open) => !open)}
                aria-expanded={showTemplates}
                aria-controls={showTemplates ? "consultant-message-templates" : undefined}
                aria-label="Chọn tin nhắn mẫu"
                className="h-10 rounded-xl px-2.5 text-xs font-bold text-foreground transition-all hover:bg-muted hover:text-primary active:scale-[0.98]"
              >
                <NotePencil className="size-4" aria-hidden="true" />
                <span>Mẫu</span>
                <CaretDown
                  className={`size-3 transition-transform ${showTemplates ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowTemplates(false);
                  onOpenWidgets();
                }}
                aria-haspopup="dialog"
                aria-label="Mở widget"
                className="h-10 rounded-xl px-2.5 text-xs font-bold text-foreground transition-all hover:bg-muted hover:text-primary active:scale-[0.98]"
              >
                <Sparkle className="size-4" aria-hidden="true" />
                <span>Widget</span>
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!draft.trim() || sending}
              aria-label={sending ? "Đang gửi tin nhắn" : "Gửi tin nhắn"}
              className="h-10 min-w-10 rounded-xl px-2.5 font-nunito text-xs font-extrabold transition-all active:scale-[0.98] sm:px-4"
            >
              <PaperPlaneRight className="size-4" aria-hidden="true" />
              <span>Gửi</span>
            </Button>
          </div>
        </form>
        {isMock && (
          <p className="mt-1 text-[11px] text-muted-foreground">Bản xem thử không lưu dữ liệu.</p>
        )}
        {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
