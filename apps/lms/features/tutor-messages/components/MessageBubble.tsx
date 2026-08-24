"use client";

import {
  Download,
  FileIcon,
} from "lucide-react";
import NextImage from "next/image";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "@workspace/ui/components/ui/message";
import type { ChatMessage, ChatParticipantRole } from "../types/messages.types";
import { formatMessageTime, formatFileSize } from "../constants/messages.utils";

const ROLE_STYLES: Record<
  ChatParticipantRole,
  { avatar: string; align: "start" | "end" }
> = {
  TUTOR:      { avatar: "bg-[#280f91] text-white", align: "end" },
  LEARNER:    { avatar: "bg-[#cfe1fa] text-[#280f91]", align: "start" },
  CONSULTANT: { avatar: "bg-[#d4eadf] text-[#447353]", align: "start" },
};

const ROLE_LABELS: Record<ChatParticipantRole, string> = {
  TUTOR: "Gia sư",
  LEARNER: "Học viên",
  CONSULTANT: "Consultant",
};

function SystemMessagePill({ text }: { text: string }) {
  return (
    <div className="flex justify-center py-2" role="status">
      <span className="rounded-full bg-[#fff8df] px-4 py-1 text-center text-xs text-[#905b0f] border border-[#ffc500]/20">
        {text}
      </span>
    </div>
  );
}

function TextBubble({ text, isMine }: { text: string; isMine: boolean }) {
  return (
    <div
      data-slot="bubble"
      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
        isMine
          ? "bg-[#280f91] text-white rounded-br-sm"
          : "bg-white text-[#0c0c0b] border border-[#e5eaf5] rounded-bl-sm"
      }`}
    >
      {text}
    </div>
  );
}

function ImageBubble({ url, name }: { url: string; name: string }) {
  return (
    <div data-slot="bubble" className="overflow-hidden rounded-2xl border border-[#e5eaf5] shadow-sm max-w-[260px]">
      <div className="relative aspect-[4/3] w-full bg-[#f0f4fd]">
        <NextImage src={url} alt={name} fill className="object-cover" sizes="260px" />
      </div>
      <p className="truncate px-3 py-1.5 text-xs text-[#667085]">{name}</p>
    </div>
  );
}

function FileBubble({ name, size, url }: { name: string; size: number; url: string }) {
  return (
    <a
      href={url}
      download={name}
      data-slot="bubble"
      className="flex items-center gap-3 rounded-2xl border border-[#e5eaf5] bg-white p-3 shadow-sm transition hover:border-[#280f91]/30 hover:bg-[#f7f9ff] max-w-[260px]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#cfe1fa]">
        <FileIcon size={18} className="text-[#280f91]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0c0c0b]">{name}</p>
        <p className="text-xs text-[#667085]">{formatFileSize(size)}</p>
      </div>
      <Download size={14} className="shrink-0 text-[#280f91]" />
    </a>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  currentRole: ChatParticipantRole;
  onWidgetAccept?: () => void;
  onWidgetDecline?: () => void;
  isConsecutive?: boolean;
}

export function MessageBubble({
  message,
  currentUserId,
  isConsecutive = false,
}: MessageBubbleProps) {
  if (message.type === "SYSTEM") {
    return <SystemMessagePill text={message.text ?? ""} />;
  }

  const isMine = message.senderId === currentUserId;
  const roleStyle = ROLE_STYLES[message.senderRole] ?? ROLE_STYLES.LEARNER;
  const align = isMine ? "end" : "start";
  const initials = message.senderName
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Message align={align} className={isConsecutive ? "mt-0.5" : "mt-3"}>
      {!isMine && !isConsecutive && (
        <MessageAvatar className={`h-8 w-8 text-xs font-bold ${roleStyle.avatar}`}>
          {initials}
        </MessageAvatar>
      )}
      {!isMine && isConsecutive && <div className="w-8 shrink-0" />}

      <MessageContent>
        {!isConsecutive && (
          <MessageHeader className="gap-1.5 px-1">
            <span className={`font-semibold text-xs ${isMine ? "text-[#280f91]" : "text-[#667085]"}`}>
              {isMine ? "Bạn" : message.senderName}
            </span>
            <span className="text-[#c2c7d6] text-xs">·</span>
            <span className="text-[#c2c7d6] text-xs">{ROLE_LABELS[message.senderRole]}</span>
          </MessageHeader>
        )}

        {message.type === "TEXT" && message.text && (
          <TextBubble text={message.text} isMine={isMine} />
        )}
        {message.type === "IMAGE" && message.attachment && (
          <ImageBubble url={message.attachment.url} name={message.attachment.name} />
        )}
        {message.type === "FILE" && message.attachment && (
          <FileBubble url={message.attachment.url} name={message.attachment.name} size={message.attachment.size} />
        )}


        <MessageFooter className={isMine ? "justify-end px-1" : "justify-start px-1"}>
          <time className="text-[10px] text-[#c2c7d6]">
            {formatMessageTime(message.createdAt)}
          </time>
        </MessageFooter>
      </MessageContent>

      {isMine && !isConsecutive && (
        <MessageAvatar className={`h-8 w-8 text-xs font-bold ${roleStyle.avatar}`}>
          {initials}
        </MessageAvatar>
      )}
      {isMine && isConsecutive && <div className="w-8 shrink-0" />}
    </Message>
  );
}
