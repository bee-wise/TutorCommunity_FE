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
import { ChatWidget } from "./ChatWidget";

const ROLE_STYLES: Record<
  ChatParticipantRole,
  { avatar: string; align: "start" | "end" }
> = {
  TUTOR:      { avatar: "bg-primary text-primary-foreground", align: "end" },
  LEARNER:    { avatar: "bg-card text-primary border border-border", align: "start" },
  CONSULTANT: { avatar: "bg-secondary text-secondary-foreground", align: "start" },
  PARTICIPANT: { avatar: "bg-card text-primary border border-border", align: "start" },
};

const ROLE_LABELS: Record<ChatParticipantRole, string> = {
  TUTOR: "Gia sư",
  LEARNER: "Học viên",
  CONSULTANT: "Tư vấn viên",
  PARTICIPANT: "Người tham gia",
};

function SystemMessagePill({ text }: { text: string }) {
  return (
    <div className="flex justify-center py-2" role="status">
      <span className="max-w-[min(100%,560px)] rounded-full border border-border bg-card px-4 py-1.5 text-center text-xs leading-5 text-muted-foreground">
        {text}
      </span>
    </div>
  );
}

function TextBubble({ text, isMine }: { text: string; isMine: boolean }) {
  return (
    <div
      data-slot="bubble"
      className={`max-w-[min(88%,480px)] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isMine
          ? "rounded-br-md bg-primary text-primary-foreground"
          : "rounded-bl-md border border-border bg-card text-card-foreground"
      }`}
    >
      {text}
    </div>
  );
}

function ImageBubble({ url, name }: { url: string; name: string }) {
  return (
    <div data-slot="bubble" className="max-w-[260px] overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <NextImage src={url} alt={name} fill className="object-cover" sizes="260px" />
      </div>
      <p className="truncate px-3 py-1.5 text-xs text-muted-foreground">{name}</p>
    </div>
  );
}

function FileBubble({ name, size, url }: { name: string; size: number; url: string }) {
  return (
    <a
      href={url}
      download={name}
      data-slot="bubble"
      className="flex max-w-[260px] items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <FileIcon size={18} className="text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
      </div>
      <Download size={14} className="shrink-0 text-primary" />
    </a>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  currentRole: ChatParticipantRole;
  isConsecutive?: boolean;
}

export function MessageBubble({
  message,
  currentUserId,
  currentRole,
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
      {!isConsecutive && (
        <MessageAvatar className={`h-8 w-8 text-xs font-bold ${roleStyle.avatar}`}>
          {initials}
        </MessageAvatar>
      )}
      {isConsecutive && <div className="w-8 shrink-0" />}

      <MessageContent className={isMine ? "items-end" : "items-start"}>
        {!isConsecutive && (
          <MessageHeader className="gap-1.5 px-1">
            <span className={`text-xs font-semibold ${isMine ? "text-primary" : "text-foreground"}`}>
              {isMine ? "Bạn" : message.senderName}
            </span>
            {message.senderId !== "SYSTEM" && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{ROLE_LABELS[message.senderRole]}</span>
              </>
            )}
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
        {message.type === "WIDGET" && message.widget && (
          <div className="mt-1 w-full max-w-[440px]">
            {message.text && <p className="mb-2 text-xs leading-5 text-muted-foreground">{message.text}</p>}
            <ChatWidget
              widget={message.widget}
              currentRole={currentRole}
            />
          </div>
        )}

        <MessageFooter className={isMine ? "justify-end px-1" : "justify-start px-1"}>
          <time className="text-[10px] text-muted-foreground">
            {formatMessageTime(message.createdAt)}
          </time>
        </MessageFooter>
      </MessageContent>

    </Message>
  );
}
