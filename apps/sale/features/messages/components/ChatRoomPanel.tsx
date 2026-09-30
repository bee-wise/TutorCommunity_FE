"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Send,
  Zap,
  ArrowLeft,
  Lock,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { MessageBubble } from "./MessageBubble";
import { AutoMessageLibrary } from "./AutoMessageLibrary";
import { ConsultantActions } from "./ConsultantActions";
import { ConnectionInfoPanel } from "./ConnectionInfoPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { STAGE_LABELS, STAGE_COLORS } from "../constants/messages.utils";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";

interface ChatRoomPanelProps {
  chatRoomId: string;
}

export function ChatRoomPanel({ chatRoomId }: ChatRoomPanelProps) {
  const {
    room,
    messages,
    sending,
    isReadOnly,
    currentUserId,
    currentUserRole,
    sendMessage,
    messagesEndRef,
    error,
    loading,
    hasOlderMessages,
    loadingOlderMessages,
    loadOlderMessages,
  } = useChatRoom(chatRoomId);

  const [text, setText] = useState("");
  const [showAutoLib, setShowAutoLib] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  if (!room) return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
      {loading ? "Đang tải phòng chat..." : error ? getApiErrorMessage(error) : "Không tìm thấy phòng chat này."}
    </div>
  );
  const isSupport = room.category === "SUPPORT";
  const peer = isSupport
    ? room.consultant
    : currentUserRole === "LEARNER" ? room.tutor : room.learner;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    try {
      await sendMessage(text);
      setText("");
      setShowAutoLib(false);
    } catch {
      // The hook exposes the API error below the message list.
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleAutoSelect = (msgText: string) => {
    setText(msgText);
    setShowAutoLib(false);
  };

  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden">
      {/* ── Main chat area ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
          <Link
            href={
              currentUserRole === "LEARNER"
                ? "/learner/messages"
                : "/tutor/messages"
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary lg:hidden"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
            {peer.initials}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-nunito truncate text-base font-extrabold text-foreground">
              {peer.name}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {isSupport
                ? `Tư vấn viên BeeWise · ${room.subject}`
                : `Phòng kết nối · Chat 3 bên với ${room.consultant.name}`}
            </p>
          </div>

          {/* Stage badge */}
          <span
            className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold sm:block ${
              isSupport
                ? "border-secondary/20 bg-secondary/10 text-secondary"
                : STAGE_COLORS[room.connectionStage] ?? "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {isSupport ? "Đang hỗ trợ" : STAGE_LABELS[room.connectionStage]}
          </span>

          {/* Info toggle */}
          {!isSupport && <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
              showInfo
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            }`}
            aria-label="Thông tin kết nối"
            aria-pressed={showInfo}
          >
            <MoreVertical size={20} />
          </button>}
        </header>

        {/* Consultant quick-action bar */}
        {currentUserRole === "CONSULTANT" && !isSupport && !isReadOnly && (
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-muted px-4 py-2">
            <ConsultantActions
              currentRole={currentUserRole}
              roomId={room.id}
            />
          </div>
        )}

        {/* Read-only banner */}
        {isReadOnly && (
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted px-4 py-2.5 text-xs text-muted-foreground">
            <Lock size={13} />
            {room.status === "CONVERTED_TO_CLASS"
              ? "Phòng chat đã chuyển thành lớp học. Chỉ đọc."
              : isSupport ? "Cuộc trò chuyện hỗ trợ đã đóng. Chỉ đọc." : "Phòng chat đã đóng. Chỉ đọc."}
          </div>
        )}

        {/* Messages area */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-muted px-3 py-5 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-1">
            {hasOlderMessages && (
              <button type="button" disabled={loadingOlderMessages} onClick={() => void loadOlderMessages()} className="mx-auto mb-3 block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary disabled:opacity-50">
                {loadingOlderMessages ? "Đang tải..." : "Xem tin nhắn cũ"}
              </button>
            )}
            {loading && <p className="py-8 text-center text-sm text-muted-foreground">Đang tải tin nhắn...</p>}
            {!loading && messages.length === 0 && !error && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.</p>}
            {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{getApiErrorMessage(error)}</p>}
            {messages.map((msg, idx) => {
              const prev = messages[idx - 1];
              const isConsecutive =
                prev &&
                prev.senderId === msg.senderId &&
                prev.type !== "SYSTEM" &&
                msg.type !== "SYSTEM";
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId}
                  currentRole={currentUserRole}
                  isConsecutive={!!isConsecutive}
                />
              );
            })}
            {sending && (
              <div className="flex justify-end px-2 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer */}
        {!isReadOnly && (
          <div className="shrink-0 border-t border-border bg-card px-3 py-3 sm:px-5">
            <div className="relative mx-auto max-w-4xl">
              {/* Auto-message library popup (Consultant only) */}
              {showAutoLib && currentUserRole === "CONSULTANT" && (
                <AutoMessageLibrary
                  onSelect={handleAutoSelect}
                  onClose={() => setShowAutoLib(false)}
                  learnerName={room.learner.name}
                  tutorName={room.tutor.name}
                  subject={room.subject}
                />
              )}

              <form onSubmit={handleSubmit} className="rounded-2xl border border-input bg-background p-2 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <textarea
                  id="chat-message-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn..."
                  rows={1}
                  className="block max-h-32 min-h-11 w-full resize-none overflow-y-auto border-0 bg-transparent px-2 py-2 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground [field-sizing:content]"
                />
                <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-2">
                  <div className="flex min-w-0 items-center gap-1">
                    {currentUserRole === "CONSULTANT" && (
                      <button type="button" onClick={() => setShowAutoLib((v) => !v)} className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${showAutoLib ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-primary"}`} aria-label="Kho tin nhắn tự động" aria-pressed={showAutoLib}>
                        <Zap size={17} className={showAutoLib ? "fill-current" : ""} />
                      </button>
                    )}
                    <span className="hidden text-[11px] text-muted-foreground sm:inline">
                      Enter để gửi · Shift + Enter xuống dòng
                    </span>
                  </div>
                  <button type="submit" disabled={!text.trim() || sending} aria-label="Gửi tin nhắn" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">
                    <Send size={16} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>

      {/* ── Info sidebar ───────────────────────────────────── */}
      {showInfo && !isSupport && (
        <div className="hidden w-72 shrink-0 overflow-y-auto lg:block">
          <ConnectionInfoPanel room={room} />
        </div>
      )}
    </div>
  );
}
