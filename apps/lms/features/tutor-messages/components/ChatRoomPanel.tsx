"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
  Lock,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { MessageBubble } from "./MessageBubble";
import { ConnectionInfoPanel } from "./ConnectionInfoPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { STAGE_LABELS, STAGE_COLORS } from "../constants/messages.utils";
import { MessagesScreen } from "./MessagesScreen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";

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
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!room) return <MessagesScreen />;
  const isSupport = room.category === "SUPPORT";
  const peer = isSupport ? room.consultant : room.learner;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
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

  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden">
      {/* ── Main chat area ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
          <Link
            href="/lms/tutor/messages"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary lg:hidden"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </Link>

          {/* Learner avatar */}
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
                : `${room.subject} ${room.gradeLevel} · Chat 3 bên với ${room.consultant.name}`}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" disabled={uploadingFile} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-primary disabled:opacity-50" aria-label="Đính kèm ảnh hoặc tệp">
                          <Paperclip size={17} aria-hidden="true" />
                          <span>Đính kèm</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="top" align="start" sideOffset={10} className="w-44 rounded-xl border-border p-1.5">
                        <DropdownMenuItem onSelect={() => imageInputRef.current?.click()} className="gap-2 rounded-lg px-3 py-2.5">
                          <ImageIcon size={16} aria-hidden="true" /> Chọn ảnh
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => fileInputRef.current?.click()} className="gap-2 rounded-lg px-3 py-2.5">
                          <FileText size={16} aria-hidden="true" /> Chọn tệp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="hidden text-[11px] text-muted-foreground sm:inline">
                      {uploadingFile ? "Đang gửi tệp..." : "Enter để gửi · Shift + Enter xuống dòng"}
                    </span>
                  </div>
                  <button type="submit" disabled={!text.trim() || sending} aria-label="Gửi tin nhắn" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]">
                    <Send size={16} aria-hidden="true" />
                  </button>
                </div>
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
      {showInfo && !isSupport && (
        <div className="hidden w-72 shrink-0 overflow-y-auto lg:block">
          <ConnectionInfoPanel room={room} />
        </div>
      )}
    </div>
  );
}
