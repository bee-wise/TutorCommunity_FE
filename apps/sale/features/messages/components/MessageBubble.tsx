"use client";

import {
  ArrowDownTrayIcon as Download,
  DocumentIcon as FileIcon,
} from "@heroicons/react/24/outline";
import NextImage from "next/image";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@workspace/ui/components/ui/message";
import type { ChatMessage, ChatParticipantRole } from "../types/messages.types";
import { formatMessageTime, formatSessionTime, formatFileSize } from "../constants/messages.utils";
import { ChatWidget } from "./ChatWidget";
import { BusinessChatWidget } from "@workspace/core/components/BusinessChatWidget";

export function SessionTimeDivider({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex justify-center py-2.5 my-1 select-none" role="separator">
      <span className="max-w-[min(100%,560px)] rounded-full border border-border/60 bg-card/80 px-3.5 py-1 text-center text-[11px] font-semibold text-muted-foreground shadow-2xs backdrop-blur-xs">
        {formatSessionTime(timestamp)}
      </span>
    </div>
  );
}


const ROLE_STYLES: Record<
  ChatParticipantRole,
  { avatar: string; align: "start" | "end" }
> = {
  TUTOR:      { avatar: "bg-primary text-primary-foreground", align: "end" },
  LEARNER:    { avatar: "bg-card text-primary border border-border", align: "start" },
  CONSULTANT: { avatar: "bg-secondary text-secondary-foreground", align: "start" },
};

const ROLE_LABELS: Record<ChatParticipantRole, string> = {
  TUTOR: "Gia sư",
  LEARNER: "Học viên",
  CONSULTANT: "Tư vấn viên",
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

function TextBubble({
  text,
  isMine,
  title,
  time,
  onContextMenu,
}: {
  text: string;
  isMine: boolean;
  title?: string;
  time?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      data-slot="bubble"
      title={title}
      onContextMenu={onContextMenu}
      className={`max-w-[min(88%,480px)] rounded-2xl px-3.5 py-2 text-sm leading-relaxed select-text ${
        isMine
          ? "rounded-br-md bg-primary text-primary-foreground"
          : "rounded-bl-md border border-border bg-card text-card-foreground"
      }`}
    >
      <div className="whitespace-pre-wrap break-words">{text}</div>
      {time && (
        <div className={`mt-1 flex items-center ${isMine ? "justify-end text-primary-foreground/75" : "justify-start text-muted-foreground"}`}>
          <time className="text-[10px] font-normal leading-none select-none">{time}</time>
        </div>
      )}
    </div>
  );
}

function ImageBubble({
  url,
  name,
  title,
  time,
  isMine,
  onContextMenu,
}: {
  url: string;
  name: string;
  title?: string;
  time?: string;
  isMine?: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      data-slot="bubble"
      title={title}
      onContextMenu={onContextMenu}
      className="relative max-w-[260px] overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        <NextImage src={url} alt={name} fill className="object-cover" sizes="260px" />
      </div>
      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground ${isMine ? "justify-between" : "flex-row-reverse justify-between"}`}>
        <p className="truncate text-xs">{name}</p>
        {time && <time className="shrink-0 text-[10px] leading-none select-none">{time}</time>}
      </div>
    </div>
  );
}

function FileBubble({
  name,
  size,
  url,
  title,
  time,
  isMine,
  onContextMenu,
}: {
  name: string;
  size: number;
  url: string;
  title?: string;
  time?: string;
  isMine?: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      data-slot="bubble"
      title={title}
      onContextMenu={onContextMenu}
      className="max-w-[260px] rounded-2xl border border-border bg-card p-3 transition hover:border-primary"
    >
      <a
        href={url}
        download={name}
        className="flex items-center gap-3"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <FileIcon width={18} height={18} className="text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
        </div>
        <Download width={14} height={14} className="shrink-0 text-primary" />
      </a>
      {time && (
        <div className={`mt-1.5 flex ${isMine ? "justify-end" : "justify-start"}`}>
          <time className="text-[10px] text-muted-foreground leading-none select-none">{time}</time>
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  currentRole: ChatParticipantRole;
  isConsecutive?: boolean;
  showTime?: boolean;
  onContextMenu?: (e: React.MouseEvent, message: ChatMessage) => void;
}

export function MessageBubble({
  message,
  currentUserId,
  currentRole,
  isConsecutive = false,
  showTime = true,
  onContextMenu,
}: MessageBubbleProps) {
  if (message.type === "SYSTEM") {
    return <SystemMessagePill text={message.text ?? ""} />;
  }

  const isMine = message.senderId === currentUserId;
  const roleStyle = ROLE_STYLES[message.senderRole] ?? ROLE_STYLES.LEARNER;
  const align = isMine ? "end" : "start";
  const formattedTime = formatMessageTime(message.createdAt);
  const initials = message.senderName
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(e, message);
    }
  };

  const bubbleTime = showTime ? formattedTime : undefined;

  return (
    <Message
      align={align}
      className={isConsecutive ? "mt-0.5" : "mt-3"}
    >
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
          <TextBubble
            text={message.text}
            isMine={isMine}
            title="Nhấn chuột phải để xem tùy chọn"
            time={bubbleTime}
            onContextMenu={handleContextMenu}
          />
        )}
        {message.type === "IMAGE" && message.attachment && (
          <ImageBubble
            url={message.attachment.url}
            name={message.attachment.name}
            title="Nhấn chuột phải để xem tùy chọn"
            time={bubbleTime}
            isMine={isMine}
            onContextMenu={handleContextMenu}
          />
        )}
        {message.type === "FILE" && message.attachment && (
          <FileBubble
            url={message.attachment.url}
            name={message.attachment.name}
            size={message.attachment.size}
            title="Nhấn chuột phải để xem tùy chọn"
            time={bubbleTime}
            isMine={isMine}
            onContextMenu={handleContextMenu}
          />
        )}
        {message.type === "WIDGET" && (message.widget || message.business) && (
          <div
            className="mt-1 w-full max-w-[440px]"
            title="Nhấn chuột phải để xem tùy chọn"
            onContextMenu={handleContextMenu}
          >
            {message.business ? (
              <BusinessChatWidget business={message.business} currentRole={currentRole} />
            ) : message.widget ? (
              <ChatWidget widget={message.widget} currentRole={currentRole} />
            ) : null}
            {showTime && (
              <div className={`mt-1 flex ${isMine ? "justify-end" : "justify-start"} px-1`}>
                <time className="text-[10px] text-muted-foreground leading-none">{formattedTime}</time>
              </div>
            )}
          </div>
        )}
      </MessageContent>

    </Message>
  );
}


