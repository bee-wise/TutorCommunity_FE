"use client";

import { ChatCircleDots, MagnifyingGlass } from "@phosphor-icons/react";
import { useLearnerMessages } from "../hooks/useLearnerMessages";
import type { LearnerConversation } from "../types/learner-messages.types";
import { ConversationListItem } from "./ConversationListItem";

export function ConversationSidebar({ selectedId }: { selectedId?: string }) {
  const messages = useLearnerMessages();
  const resultCount = messages.activeConversations.length + messages.closedConversations.length;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-border bg-white lg:w-[340px] lg:rounded-2xl lg:border">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-5">
        <h1 className="text-xl font-extrabold text-slate-950">Tin nhắn với gia sư</h1>
        <p className="mt-1 text-sm text-slate-500">Trao đổi theo từng lớp học</p>
      </header>

      <div className="shrink-0 space-y-2 border-b border-border p-3">
        <label className="relative block">
          <span className="sr-only">Tìm cuộc trò chuyện</span>
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input
            type="search"
            value={messages.search}
            onChange={(event) => messages.setSearch(event.target.value)}
            placeholder="Tìm gia sư hoặc lớp học..."
            className="h-10 w-full rounded-xl border border-input bg-[#F8FAFC] pl-9 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20"
          />
        </label>
        <label>
          <span className="sr-only">Lọc theo lớp học</span>
          <select value={messages.classId} onChange={(event) => messages.setClassId(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20">
            <option value="all">Tất cả lớp học</option>
            {messages.classOptions.map((conversation) => <option key={conversation.classId} value={conversation.classId}>{conversation.className}</option>)}
          </select>
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {resultCount === 0 ? (
          <div className="px-5 py-14 text-center">
            <ChatCircleDots className="mx-auto text-slate-400" size={32} weight="duotone" />
            <p className="mt-3 text-sm font-extrabold text-slate-900">Không tìm thấy cuộc trò chuyện</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Hãy thử từ khóa hoặc lớp học khác.</p>
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
    <section className={muted ? "rounded-xl bg-slate-50 p-1.5" : "px-1.5"}>
      <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
        <h2 className={`text-xs font-extrabold ${muted ? "text-slate-500" : "text-[#280F91]"}`}>{title}</h2>
        <span className="text-xs font-semibold text-slate-400">{conversations.length}</span>
      </div>
      <div className="space-y-1">{conversations.map((conversation) => <ConversationListItem key={conversation.id} conversation={conversation} selected={conversation.id === selectedId} />)}</div>
    </section>
  );
}
