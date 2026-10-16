import { Fragment, type RefObject } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import type { ClassChatMessage } from "../types/class-chat.types";

const formatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});
const dayFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

function getSenderInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "BW";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function ClassChatHistory({
  messages,
  historyRef,
  currentUserId,
}: {
  messages: readonly ClassChatMessage[];
  historyRef: RefObject<HTMLDivElement | null>;
  currentUserId?: string;
}) {
  return (
    <div
      ref={historyRef}
      role="log"
      aria-label="Tin nhắn của lớp"
      aria-live="polite"
      aria-relevant="additions"
      className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-muted/50 px-3 py-5 sm:px-6"
    >
      {!messages.length && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Chưa có tin nhắn. Bắt đầu trao đổi với học viên trong lớp.
        </p>
      )}
      {messages.map((message, index) => {
        const own = currentUserId
          ? message.senderId === currentUserId
          : message.senderRole === "TUTOR";
        const senderLabel = own ? "Bạn" : message.senderName;
        const safeAvatar = safeExternalUrl(message.avatarUrl);
        const day = dayFormatter.format(new Date(message.createdAt));
        const previousDay =
          index > 0
            ? dayFormatter.format(new Date(messages[index - 1].createdAt))
            : null;
        return (
          <Fragment key={message.id}>
            {day !== previousDay && (
              <div className="flex justify-center py-2" role="separator">
                <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {day}
                </span>
              </div>
            )}
            <article
              className={`mx-auto flex max-w-4xl gap-2.5 ${
                own ? "flex-row-reverse justify-start" : "justify-start"
              }`}
            >
              <Avatar
                className="mt-0.5 size-8 shrink-0 rounded-full border border-border/50 bg-card select-none"
                aria-hidden="true"
              >
                <AvatarImage
                  src={safeAvatar ?? undefined}
                  alt=""
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="rounded-full bg-muted font-lms text-xs font-bold text-foreground/80">
                  {getSenderInitials(senderLabel)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`min-w-0 max-w-[calc(100%-2.75rem)] space-y-1 sm:max-w-[72%] flex flex-col ${
                  own ? "items-end" : "items-start"
                }`}
              >
                <p
                  className={`px-1 text-[11px] font-bold text-muted-foreground ${
                    own ? "text-right" : ""
                  }`}
                >
                  {senderLabel}
                </p>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-2xs ${
                    own
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border bg-card text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <time
                    dateTime={message.createdAt}
                    className={`mt-1 block text-right text-[10px] ${
                      own
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatter.format(new Date(message.createdAt))}
                  </time>
                </div>
              </div>
            </article>
          </Fragment>
        );
      })}
    </div>
  );
}
