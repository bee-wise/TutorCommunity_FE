"use client";

import { ChatBubbleLeftRightIcon as ChatCircleDots } from "@heroicons/react/24/outline";
import { ConversationSidebar } from "./ConversationSidebar";
import { LearnerChatPanel } from "./LearnerChatPanel";

export function LearnerMessagesScreen({
  conversationId,
}: {
  conversationId?: string;
}) {
  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden bg-muted lg:p-1">
      <div className="mx-auto flex h-full max-w-[1400px] gap-4 overflow-hidden">
        <div
          className={
            conversationId ? "hidden lg:block" : "w-full lg:block lg:w-auto"
          }
        >
          <ConversationSidebar selectedId={conversationId} />
        </div>
        {conversationId ? (
          <LearnerChatPanel
            key={conversationId}
            conversationId={conversationId}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

function EmptyChatState() {
  return (
    <section className="hidden flex-1 place-items-center rounded-3xl border border-dashed border-border bg-card lg:grid">
      <div className="max-w-sm px-6 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-primary">
          <ChatCircleDots width={27} height={27} />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-foreground">
          Chọn một cuộc trò chuyện
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Trao đổi bài học với gia sư hoặc xem lại lịch sử của những lớp đã kết
          thúc.
        </p>
      </div>
    </section>
  );
}
