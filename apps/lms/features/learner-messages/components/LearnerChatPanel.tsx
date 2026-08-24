"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, LockSimple, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import { useLearnerConversation } from "../hooks/useLearnerConversation";
import { CLOSE_REASON_LABELS } from "../utils/learner-messages.utils";
import { LearnerMessageBubble } from "./LearnerMessageBubble";

export function LearnerChatPanel({ conversationId }: { conversationId: string }) {
  const {
    conversation,
    messages,
    sending,
    messagesContainerRef,
    sendMessage,
  } = useLearnerConversation(conversationId);
  const [text, setText] = useState("");

  if (!conversation) {
    return <MissingConversation />;
  }

  const isClosed = conversation.status === "CLOSED";
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    void sendMessage(text);
    setText("");
  };

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white lg:rounded-2xl lg:border lg:border-border" aria-label={`Cuộc trò chuyện với ${conversation.tutor.name}`}>
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-3 sm:px-4">
        <Link href="/lms/learner/chat" aria-label="Quay lại danh sách tin nhắn" className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"><ArrowLeft size={19} weight="bold" /></Link>
        <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-extrabold ${isClosed ? "bg-slate-200 text-slate-600" : "bg-[#CFE1FA] text-[#280F91]"}`}>{conversation.tutor.initials}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-extrabold text-slate-950 sm:text-base">{conversation.tutor.name}</h1>
            {!isClosed && conversation.tutor.isOnline ? <span className="shrink-0 text-xs font-semibold text-[#447353]">Đang online</span> : null}
          </div>
          <p className="truncate text-xs text-slate-500">{conversation.className}</p>
        </div>
        <span className={`hidden rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${isClosed ? "bg-slate-100 text-slate-600" : "bg-[#DDF1E5] text-[#365D43]"}`}>{isClosed ? "Đã đóng" : "Đang học"}</span>
      </header>

      {isClosed ? (
        <div className="flex shrink-0 items-start gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
          <LockSimple className="mt-0.5 shrink-0" size={15} weight="bold" />
          <span>{conversation.closeReason ? CLOSE_REASON_LABELS[conversation.closeReason] : "Cuộc trò chuyện đã đóng"}. Bạn vẫn có thể xem lại lịch sử tin nhắn.</span>
        </div>
      ) : null}

      <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFC] px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-3xl space-y-3">{messages.map((message) => <LearnerMessageBubble key={message.id} message={message} />)}</div>
      </div>

      {isClosed ? (
        <div className="shrink-0 border-t border-border bg-white px-4 py-4 text-center">
          <p className="text-sm font-semibold text-slate-600">Cuộc trò chuyện đã đóng. Bạn không thể gửi thêm tin nhắn.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex shrink-0 items-end gap-2 border-t border-border bg-white p-3 sm:p-4">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Nội dung tin nhắn</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder="Nhập tin nhắn cho gia sư..." className="max-h-28 min-h-11 w-full resize-none rounded-xl border border-input bg-[#F8FAFC] px-4 py-2.5 text-sm leading-6 outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" />
          </label>
          <button type="submit" disabled={!text.trim() || sending} aria-label="Gửi tin nhắn" className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#280F91] text-white transition-transform hover:bg-[#1F0B70] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"><PaperPlaneTilt size={18} weight="fill" /></button>
        </form>
      )}
    </section>
  );
}

function MissingConversation() {
  return <div className="grid h-full flex-1 place-items-center bg-white p-6 text-center lg:rounded-2xl lg:border lg:border-border"><div><WarningCircle className="mx-auto text-[#905B0F]" size={34} weight="duotone" /><h1 className="mt-3 text-lg font-extrabold text-slate-950">Không tìm thấy cuộc trò chuyện</h1><Link href="/lms/learner/chat" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại danh sách</Link></div></div>;
}
