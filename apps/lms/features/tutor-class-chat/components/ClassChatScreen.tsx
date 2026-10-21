"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { ClassMissingState } from "../../tutor-classes/components/ClassMissingState";
import { ClassQueryErrorState } from "../../tutor-classes/components/ClassQueryErrorState";
import { useClassChat } from "../hooks/useClassChat";
import { ClassChatComposer } from "./ClassChatComposer";
import { ClassChatHistory } from "./ClassChatHistory";
import { ClassChatReadOnly } from "./ClassChatReadOnly";
import { ClassChatSkeleton } from "./ClassChatSkeleton";

export function ClassChatScreen({ classId }: { classId: string }) {
  const chat = useClassChat(classId);
  if (chat.loading) return <ClassChatSkeleton />;
  if (chat.error)
    return (
      <ClassQueryErrorState error={chat.error} onRetry={chat.retry} detail />
    );
  if (!chat.classInfo) return <ClassMissingState />;
  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1400px] flex-col p-0 sm:p-3 lg:p-4">
      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden border border-border bg-card shadow-soft sm:rounded-3xl"
        aria-label="Phòng chat chung của lớp"
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <Link
              href={chat.actorRole === "LEARNER" ? "/lms/learner/chat" : `/lms/tutor/classes/${classId}`}
              aria-label="Quay lại danh sách"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ChatBubbleLeftRightIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-lms text-base font-extrabold text-primary">
              Tin nhắn lớp học
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Phòng chat chung của lớp
            </p>
          </div>
          <span
            className={`hidden shrink-0 rounded-full border px-3 py-1 text-xs font-bold sm:inline-flex ${
              chat.room?.readOnly
                ? "border-border bg-muted text-muted-foreground"
                : "border-secondary/30 bg-secondary/15 text-foreground"
            }`}
          >
            {chat.room?.readOnly ? "Chỉ xem" : "Đang trao đổi"}
          </span>
        </header>
        {chat.room && (
          <>
            {chat.room.readOnly && <ClassChatReadOnly />}
            {chat.hasMore && (
              <Button
                variant="outline"
                className="mx-auto mt-3 min-h-9 rounded-xl transition-all active:scale-[0.98]"
                disabled={chat.loadingOlder}
                onClick={() => void chat.loadOlder()}
              >
                Tin nhắn cũ hơn
              </Button>
            )}
            <ClassChatHistory
              messages={chat.room.messages}
              historyRef={chat.historyRef}
              currentUserId={chat.actorId}
            />
            {!chat.room.readOnly && (
              <ClassChatComposer
                form={chat.form}
                sending={chat.sending}
                onSubmit={chat.submit}
              />
            )}
          </>
        )}
        {!chat.room && <div className="grid flex-1 place-items-center bg-muted/40 p-6 text-center text-sm text-muted-foreground">Phòng chat lớp chưa sẵn sàng.</div>}
      </section>
    </div>
  );
}
