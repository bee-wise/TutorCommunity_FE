"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeftIcon as ArrowLeft, LockClosedIcon as LockSimple, PaperAirplaneIcon as PaperPlaneTilt, ExclamationCircleIcon as WarningCircle } from "@heroicons/react/24/outline";
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
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-card lg:rounded-3xl lg:border lg:border-border" aria-label={`Cuộc trò chuyện với ${conversation.tutor.name}`}>
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-3 sm:px-4">
        <Link href="/lms/learner/chat" aria-label="Quay lại danh sách tin nhắn" className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted lg:hidden"><ArrowLeft width={19} height={19} /></Link>
        <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-extrabold ${isClosed ? "bg-border text-muted-foreground" : "bg-muted text-primary"}`}>{conversation.tutor.initials}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-extrabold text-primary sm:text-base">{conversation.tutor.name}</h1>
            {!isClosed && conversation.tutor.isOnline ? <span className="shrink-0 text-xs font-semibold text-foreground">Đang online</span> : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">{conversation.className}</p>
        </div>
        <span className={`hidden rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${isClosed ? "bg-muted text-muted-foreground" : "bg-secondary/15 text-foreground"}`}>{isClosed ? "Đã đóng" : "Đang học"}</span>
      </header>

      {isClosed ? (
        <div className="flex shrink-0 items-start gap-2 border-b border-border bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">
          <LockSimple className="mt-0.5 shrink-0" width={15} height={15} />
          <span>{conversation.closeReason ? CLOSE_REASON_LABELS[conversation.closeReason] : "Cuộc trò chuyện đã đóng"}. Bạn vẫn có thể xem lại lịch sử tin nhắn.</span>
        </div>
      ) : null}

      <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto bg-muted px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-3xl space-y-3">{messages.map((message) => <LearnerMessageBubble key={message.id} message={message} />)}</div>
      </div>

      {isClosed ? (
        <div className="shrink-0 border-t border-border bg-card px-4 py-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Cuộc trò chuyện đã đóng. Bạn không thể gửi thêm tin nhắn.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex shrink-0 items-end gap-2 border-t border-border bg-card p-3 sm:p-4">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Nội dung tin nhắn</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder="Nhập tin nhắn cho gia sư..." className="max-h-28 min-h-11 w-full resize-none rounded-xl border border-input bg-muted px-4 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <button type="submit" disabled={!text.trim() || sending} aria-label="Gửi tin nhắn" className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"><PaperPlaneTilt width={18} height={18} /></button>
        </form>
      )}
    </section>
  );
}

function MissingConversation() {
  return <div className="grid h-full flex-1 place-items-center bg-card p-6 text-center lg:rounded-2xl lg:border lg:border-border"><div><WarningCircle className="mx-auto text-warning" width={34} height={34} /><h1 className="mt-3 text-lg font-extrabold text-primary">Không tìm thấy cuộc trò chuyện</h1><Link href="/lms/learner/chat" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Quay lại danh sách</Link></div></div>;
}
