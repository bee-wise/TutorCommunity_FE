"use client";

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@workspace/ui/components/ui/message";
import type { WorkspaceMessage, WorkspaceParticipant, ParticipantRole } from "../types/workspace";
import { BusinessChatWidget } from "@workspace/core/components/BusinessChatWidget";
import {
  formatMessageTime,
  formatSessionTime,
  initials,
} from "../utils/format";

export function SessionTimeDivider({ timestamp }: { timestamp: string }) {
  return (
    <div
      className="my-1 flex justify-center py-2.5 select-none"
      role="separator"
    >
      <span className="max-w-[min(100%,560px)] rounded-full border border-border/60 bg-card/80 px-3.5 py-1 text-center text-[11px] font-semibold text-muted-foreground shadow-2xs backdrop-blur-xs">
        {formatSessionTime(timestamp)}
      </span>
    </div>
  );
}

const ROLE_STYLES: Record<
  ParticipantRole,
  { avatar: string; align: "start" | "end" }
> = {
  TUTOR: { avatar: "bg-primary text-primary-foreground", align: "end" },
  LEARNER: {
    avatar: "bg-card text-primary border border-border",
    align: "start",
  },
  CONSULTANT: {
    avatar: "bg-secondary text-secondary-foreground",
    align: "start",
  },
};

const ROLE_LABELS: Record<ParticipantRole, string> = {
  TUTOR: "Gia sư",
  LEARNER: "Học viên",
  CONSULTANT: "Tư vấn viên",
};

export function SystemMessagePill({ text }: { text: string }) {
  return (
    <div className="flex justify-center py-2" role="status">
      <span className="max-w-[min(100%,560px)] rounded-full border border-border bg-card px-4 py-1.5 text-center text-xs leading-5 text-muted-foreground shadow-2xs">
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
}: {
  text: string;
  isMine: boolean;
  title?: string;
  time?: string;
}) {
  return (
    <div
      data-slot="bubble"
      title={title}
      className={`max-w-[min(88%,480px)] rounded-2xl px-3.5 py-2 text-sm leading-relaxed select-text shadow-xs ${
        isMine
          ? "rounded-br-md bg-primary text-primary-foreground"
          : "rounded-bl-md border border-border bg-card text-card-foreground"
      }`}
    >
      <div className="whitespace-pre-wrap break-words">{text}</div>
      {time && (
        <div
          className={`mt-1 flex items-center ${
            isMine
              ? "justify-end text-primary-foreground/75"
              : "justify-start text-muted-foreground"
          }`}
        >
          <time className="text-[10px] font-normal leading-none select-none">
            {time}
          </time>
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: WorkspaceMessage;
  consultantId: string;
  sender?: WorkspaceParticipant;
  isConsecutive?: boolean;
  showTime?: boolean;
}

export function MessageBubble({
  message,
  consultantId,
  sender,
  isConsecutive = false,
  showTime = true,
}: MessageBubbleProps) {
  if (message.isSystem) {
    return <SystemMessagePill text={message.content ?? ""} />;
  }

  const isMine =
    message.senderId === consultantId ||
    message.senderId === "preview-consultant";

  const resolvedRole: ParticipantRole = isMine
    ? "CONSULTANT"
    : sender?.role ?? "LEARNER";

  const roleStyle = ROLE_STYLES[resolvedRole] ?? ROLE_STYLES.LEARNER;
  const align = isMine ? "end" : "start";
  const formattedTime = formatMessageTime(message.createdAt);
  const senderName = isMine ? "Bạn" : sender?.name ?? "Người tham gia";
  const senderInitials = initials(senderName);
  const bubbleTime = showTime ? formattedTime : undefined;

  return (
    <Message align={align} className={isConsecutive ? "mt-0.5" : "mt-3"}>
      {!isConsecutive && (
        <MessageAvatar
          className={`h-8 w-8 text-xs font-bold ${roleStyle.avatar}`}
        >
          {senderInitials}
        </MessageAvatar>
      )}
      {isConsecutive && <div className="w-8 shrink-0" />}

      <MessageContent className={isMine ? "items-end" : "items-start"}>
        {!isConsecutive && (
          <MessageHeader className="gap-1.5 px-1">
            <span
              className={`text-xs font-semibold ${
                isMine ? "text-primary" : "text-foreground"
              }`}
            >
              {senderName}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {ROLE_LABELS[resolvedRole]}
            </span>
          </MessageHeader>
        )}

        {message.business ? (
          <div className="max-w-full">
            {message.content && <p className="mb-2 max-w-[440px] text-xs text-muted-foreground">{message.content}</p>}
            <BusinessChatWidget business={message.business} currentRole="CONSULTANT" />
            {bubbleTime && <time className="mt-1 block text-right text-[10px] text-muted-foreground">{bubbleTime}</time>}
          </div>
        ) : <TextBubble text={message.content} isMine={isMine} time={bubbleTime} />}
      </MessageContent>
    </Message>
  );
}
