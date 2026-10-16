"use client";

import { ChatBubbleLeftRightIcon as ChatCircleDots, MagnifyingGlassIcon as MagnifyingGlass } from "@heroicons/react/24/outline";
import { useLearnerMessages } from "../hooks/useLearnerMessages";
import type { LearnerConversation } from "../types/learner-messages.types";
import { ConversationListItem } from "./ConversationListItem";
import { LmsSelect } from "@/components/LmsSelect";

export function ConversationSidebar({ selectedId }: { selectedId?: string }) {
  const messages = useLearnerMessages();
  const resultCount = messages.activeConversations.length + messages.closedConversations.length;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-border bg-card lg:w-[340px] lg:rounded-3xl lg:border">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-5">
        <h1 className="text-xl font-extrabold text-foreground">Tin nhắn với gia sư</h1>
      </header>

      <div className="shrink-0 space-y-2 border-b border-border p-3">
        <label className="relative block">
          <span className="sr-only">Tìm cuộc trò chuyện</span>
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={17} height={17} />
          <input
            type="search"
            value={messages.search}
            onChange={(event) => messages.setSearch(event.target.value)}
            placeholder="Tìm gia sư hoặc lớp học..."
            className="h-10 w-full rounded-xl border border-input bg-muted pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <div><label htmlFor="conversation-class-filter" className="sr-only">Lọc theo lớp học</label><LmsSelect id="conversation-class-filter" value={messages.classId} onValueChange={messages.setClassId} options={[{ value: "all", label: "Tất cả lớp học" }, ...messages.classOptions.map((conversation) => ({ value: conversation.classId, label: conversation.className }))]} /></div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {resultCount === 0 ? (
          <div className="px-5 py-14 text-center">
            <ChatCircleDots className="mx-auto text-muted-foreground" width={32} height={32} />
            <p className="mt-3 text-sm font-extrabold text-foreground">Không tìm thấy cuộc trò chuyện</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Hãy thử từ khóa hoặc lớp học khác.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <ConversationSection title="Đang học" conversations={messages.activeConversations} selectedId={selectedId} />
            <ConversationSection title="Đã đóng" conversations={messages.closedConversations} selectedId={selectedId} muted />
          </div>
        )}
      </div>
    </aside>
  );
}

function ConversationSection({ title, conversations, selectedId, muted = false }: { title: string; conversations: LearnerConversation[]; selectedId?: string; muted?: boolean }) {
  if (conversations.length === 0) return null;
  return (
    <section className={muted ? "rounded-xl bg-muted p-1.5" : "px-1.5"}>
      <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
        <h2 className={`text-xs font-extrabold ${muted ? "text-muted-foreground" : "text-primary"}`}>{title}</h2>
        <span className="text-xs font-semibold text-muted-foreground">{conversations.length}</span>
      </div>
      <div className="space-y-1">{conversations.map((conversation) => <ConversationListItem key={conversation.id} conversation={conversation} selected={conversation.id === selectedId} />)}</div>
    </section>
  );
}
