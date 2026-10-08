"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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
    <div className="relative shrink-0 border-t border-border bg-card px-3 py-2.5 sm:px-5">
      <div className="relative mx-auto max-w-4xl">
        {showTemplates && (
          <div className="absolute inset-x-0 bottom-full z-20 mb-2 rounded-2xl border border-border bg-card p-3 shadow-soft sm:inset-x-auto sm:right-0 sm:w-[420px]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <strong className="font-nunito text-sm font-extrabold text-foreground">Tin nhắn mẫu</strong>
              <Button type="button" variant="ghost" onClick={() => setShowTemplates(false)} className="h-7 rounded-lg px-2 text-xs transition-all active:scale-95">Đóng</Button>
            </div>
            <div className="space-y-1.5">
              {messageTemplates.map((template) => (
                <button
                  type="button"
                  key={template.id}
                  onClick={() => {
                    onDraftChange(template.content);
                    setShowTemplates(false);
                    textareaRef.current?.focus();
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left transition-all hover:border-primary/40 hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="min-w-0">
                    <strong className="block text-xs font-bold text-foreground">{template.title}</strong>
                    <span className="block truncate text-[11px] text-muted-foreground">{template.description}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-bold text-primary">Dùng mẫu</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-end gap-2">
          <form
            onSubmit={(event) => { event.preventDefault(); submit(); }}
            className="flex min-w-0 flex-1 items-end gap-1.5 rounded-2xl border border-input bg-background p-1.5 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/20"
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Nội dung tin nhắn</span>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Soạn tin nhắn · Enter để gửi"
                className="max-h-24 min-h-9 w-full resize-none bg-transparent px-2 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button type="submit" disabled={!draft.trim() || sending} aria-label="Gửi tin nhắn" className="size-9 shrink-0 rounded-xl p-0 transition-all active:scale-95">
              <PaperPlaneRight width={17} height={17} />
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTemplates((open) => !open)}
            aria-expanded={showTemplates}
            aria-label="Chọn tin nhắn mẫu"
            className="h-12 shrink-0 rounded-xl border-border bg-background px-3 text-xs font-bold transition-all hover:bg-muted active:scale-95"
          >
            <NotePencil width={16} height={16} />
            <span className="hidden sm:inline">Mẫu</span>
            <CaretDown width={12} height={12} className="hidden sm:block" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenWidgets}
            aria-haspopup="dialog"
            className="h-12 shrink-0 rounded-xl border-border bg-background px-3 text-xs font-bold transition-all hover:bg-muted active:scale-95"
          >
            <Sparkle width={16} height={16} aria-hidden="true" />
            <span className="hidden sm:inline">Widget</span>
          </Button>
        </div>
        {isMock && <p className="mt-1 text-[11px] text-muted-foreground">Bản xem thử không lưu dữ liệu.</p>}
        {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
