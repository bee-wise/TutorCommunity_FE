"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { ClassMissingState } from "../../tutor-classes/components/ClassMissingState";
import { useClassChat } from "../hooks/useClassChat";
import { ClassChatComposer } from "./ClassChatComposer";
import { ClassChatHistory } from "./ClassChatHistory";
import { ClassChatReadOnly } from "./ClassChatReadOnly";
import { ClassChatSkeleton } from "./ClassChatSkeleton";

export function ClassChatScreen({ classId }: { classId: string }) {
  const chat = useClassChat(classId);
  if (!chat.classInfo) return <ClassMissingState />;
  if (chat.loading) return <ClassChatSkeleton />;
  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1400px] flex-col gap-4 p-1 sm:p-2 lg:px-1">
      <h1 className="sr-only">Tin nhắn lớp</h1>
      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft"
        aria-label="Phòng chat chung của lớp"
      >
        {chat.error ? (
          <div role="alert" className="space-y-4 p-6">
            <p className="text-sm text-destructive">
              Không tải được tin nhắn lớp. Hãy thử lại.
            </p>
            <Button
              variant="outline"
              className="min-h-11 rounded-xl transition-all active:scale-[0.98]"
              onClick={() => {
                void chat.retry();
              }}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          chat.room && (
            <>
              <ClassChatHistory
                messages={chat.room.messages}
                historyRef={chat.historyRef}
              />
              {chat.room.readOnly ? (
                <ClassChatReadOnly />
              ) : (
                <ClassChatComposer
                  form={chat.form}
                  sending={chat.sending}
                  onSubmit={chat.submit}
                />
              )}
            </>
          )
        )}
      </section>
    </div>
  );
}
