"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import {
  Send,
  Paperclip,
  Zap,
  Image as ImageIcon,
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
import type { ChatParticipantRole } from "../types/messages.types";
import { MessagesScreen } from "./MessagesScreen";

interface ChatRoomPanelProps {
  chatRoomId: string;
}

export function ChatRoomPanel({ chatRoomId }: ChatRoomPanelProps) {
  const {
    room,
    messages,
    sending,
    uploadingFile,
    isReadOnly,
    currentUserId,
    currentUserRole,
    sendMessage,
    sendFile,
    messagesEndRef,
  } = useChatRoom(chatRoomId);

  const [text, setText] = useState("");
  const [showAutoLib, setShowAutoLib] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!room) return <MessagesScreen />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
    setShowAutoLib(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await sendFile(file);
    e.target.value = "";
  };

  const handleAutoSelect = (msgText: string) => {
    setText(msgText);
    setShowAutoLib(false);
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* ── Main chat area ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-[#e5eaf5] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-[#f0f3f9] px-4 py-3">
          <Link
            href={
              currentUserRole === "LEARNER"
                ? "/learner/messages"
                : "/tutor/messages"
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#667085] transition hover:bg-[#f0f3f9] hover:text-[#280f91] lg:hidden"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </Link>

          {/* Learner avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfe1fa] text-sm font-black text-[#280f91]">
            {room.learner.initials}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-nunito truncate text-base font-extrabold text-[#0c0c0b]">
              {room.learner.name}
            </h1>
            <p className="text-xs text-[#667085]">
              {room.subject} {room.gradeLevel} · {room.tutor.name}
            </p>
          </div>

          {/* Stage badge */}
          <span
            className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold sm:block ${
              STAGE_COLORS[room.connectionStage] ??
              "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {STAGE_LABELS[room.connectionStage]}
          </span>

          {/* Info toggle */}
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
              showInfo
                ? "bg-[#280f91] text-white"
                : "text-[#667085] hover:bg-[#f0f3f9] hover:text-[#280f91]"
            }`}
            aria-label="Thông tin kết nối"
            aria-pressed={showInfo}
          >
            <MoreVertical size={20} />
          </button>
        </header>

        {/* Consultant quick-action bar */}
        {currentUserRole === "CONSULTANT" && !isReadOnly && (
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-[#f0f3f9] bg-[#fafbfe] px-4 py-2">
            <ConsultantActions
              currentRole={currentUserRole}
              onSendTrialScheduleWidget={() => {}}
              onSendConfirmWidget={() => {}}
              onSendCloseWidget={() => {}}
            />
          </div>
        )}

        {/* Read-only banner */}
        {isReadOnly && (
          <div className="flex shrink-0 items-center gap-2 bg-[#f7f9ff] px-4 py-2.5 text-xs text-[#667085]">
            <Lock size={13} />
            {room.status === "CONVERTED_TO_CLASS"
              ? "Phòng chat đã chuyển thành lớp học. Chỉ đọc."
              : "Phòng chat đã đóng. Chỉ đọc."}
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-0.5">
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
            {(sending || uploadingFile) && (
              <div className="flex justify-end px-2 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#280f91] [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#280f91] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#280f91] [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        {!isReadOnly && (
          <div className="shrink-0 border-t border-[#f0f3f9] bg-white px-4 py-3">
            <div className="relative">
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

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* File attachment buttons */}
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#667085] transition hover:bg-[#f0f3f9] hover:text-[#280f91]"
                    aria-label="Gửi hình ảnh"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#667085] transition hover:bg-[#f0f3f9] hover:text-[#280f91]"
                    aria-label="Đính kèm file"
                  >
                    <Paperclip size={20} />
                  </button>
                  {/* Auto-message library button (Consultant only) */}
                  {currentUserRole === "CONSULTANT" && (
                    <button
                      type="button"
                      onClick={() => setShowAutoLib((v) => !v)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        showAutoLib
                          ? "bg-[#ffc500] text-[#280f91]"
                          : "text-[#667085] hover:bg-[#f0f3f9] hover:text-[#280f91]"
                      }`}
                      aria-label="Kho tin nhắn tự động"
                      aria-pressed={showAutoLib}
                    >
                      <Zap
                        size={20}
                        className={showAutoLib ? "fill-[#280f91]" : ""}
                      />
                    </button>
                  )}
                </div>

                {/* Text input */}
                <div className="relative min-w-0 flex-1">
                  <textarea
                    id="chat-message-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn... (Enter để gửi)"
                    rows={1}
                    className="w-full resize-none rounded-2xl border border-[#dce7f7] bg-[#f7f9ff] px-4 py-2.5 text-sm text-[#0c0c0b] outline-none placeholder:text-[#c2c7d6] focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/20 max-h-32 overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                  />
                </div>

                {/* Send */}
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  aria-label="Gửi tin nhắn"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#280f91] text-white shadow-sm transition hover:bg-[#1f0b70] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.96]"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="*/*"
            />
            <input
              ref={imageInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}
      </div>

      {/* ── Info sidebar ───────────────────────────────────── */}
      {showInfo && (
        <div className="hidden w-72 shrink-0 overflow-y-auto lg:block">
          <ConnectionInfoPanel room={room} />
        </div>
      )}
    </div>
  );
}
