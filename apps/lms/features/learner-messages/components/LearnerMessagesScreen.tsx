"use client";

import { ChatCircleDots } from "@phosphor-icons/react";
import { ConversationSidebar } from "./ConversationSidebar";
import { LearnerChatPanel } from "./LearnerChatPanel";

export function LearnerMessagesScreen({ conversationId }: { conversationId?: string }) {
  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden bg-[#F8FAFC] lg:p-4">
      <div className="mx-auto flex h-full max-w-[1400px] gap-4 overflow-hidden">
        <div className={conversationId ? "hidden lg:block" : "w-full lg:block lg:w-auto"}>
          <ConversationSidebar selectedId={conversationId} />
        </div>
        {conversationId ? <LearnerChatPanel key={conversationId} conversationId={conversationId} /> : <EmptyChatState />}
      </div>
    </div>
  );
}

function EmptyChatState() {
  return (
    <section className="hidden flex-1 place-items-center rounded-2xl border border-dashed border-[#CFE1FA] bg-white lg:grid">
      <div className="max-w-sm px-6 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#EEF2FF] text-[#280F91]"><ChatCircleDots size={27} weight="duotone" /></span>
        <h2 className="mt-4 text-lg font-extrabold text-slate-950">Chọn một cuộc trò chuyện</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Trao đổi bài học với gia sư hoặc xem lại lịch sử của những lớp đã kết thúc.</p>
      </div>
    </section>
  );
}
