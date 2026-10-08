"use client";

import { useEffect, useRef } from "react";
import {
  UserGroupIcon as UsersThree,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { selectTrialWidgetTimelineMessages } from "@workspace/core/services/trial-widget-timeline";
import { shouldShowSessionDivider } from "../utils/format";
import type { WorkspaceMessage, WorkspaceRoom } from "../types/workspace";
import { MessageBubble, SessionTimeDivider } from "./MessageBubble";

export function ConversationTimeline({
  room,
  messages,
  consultantId,
  loading,
  error,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  onRetry,
}: {
  room: WorkspaceRoom;
  messages: WorkspaceMessage[];
  consultantId: string;
  loading: boolean;
  error: unknown;
  hasOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const visibleMessages = selectTrialWidgetTimelineMessages(
    messages,
    (message) => message.senderId === consultantId,
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, room.id]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-1">
        {hasOlder && (
          <div className="flex justify-center pb-2">
            <Button
              type="button"
              variant="outline"
              disabled={loadingOlder}
              onClick={onLoadOlder}
              className="h-8 rounded-full border-border bg-card px-4 text-xs font-semibold text-primary transition-all active:scale-95"
            >
              {loadingOlder ? "Đang tải..." : "Xem tin nhắn cũ hơn"}
            </Button>
          </div>
        )}
        {loading && <p className="py-10 text-center text-xs text-muted-foreground">Đang tải tin nhắn...</p>}
        {Boolean(error) && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-card p-3 text-center text-xs text-destructive">
            {getApiErrorMessage(error)}{" "}
            <Button type="button" variant="outline" onClick={onRetry} className="ml-2 h-7 rounded-lg px-2 text-xs transition-all active:scale-95">Thử lại</Button>
          </div>
        )}
        {!loading && !error && messages.length === 0 && (
          <div className="py-14 text-center text-xs text-muted-foreground">
            <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UsersThree width={18} height={18} />
            </span>
            Chưa có tin nhắn trong phòng này.
          </div>
        )}
        {visibleMessages.map((message, idx) => {
          const prev = visibleMessages[idx - 1];
          const next = visibleMessages[idx + 1];
          const isNewSession = !prev || prev.isSystem || shouldShowSessionDivider(message.createdAt, prev.createdAt, 2);
          const isConsecutive = !isNewSession && prev && prev.senderId === message.senderId && !prev.isSystem && !message.isSystem;
          const isNextNewSession = next && shouldShowSessionDivider(next.createdAt, message.createdAt, 2);
          const isLastInTurn = !next || next.isSystem || next.senderId !== message.senderId || isNextNewSession;
          const sender = room.participants.find((person) => person.id === message.senderId);

          return (
            <div key={message.id}>
              {isNewSession && !message.isSystem && <SessionTimeDivider timestamp={message.createdAt} />}
              <MessageBubble
                message={message}
                consultantId={consultantId}
                sender={sender}
                isConsecutive={isConsecutive}
                showTime={isLastInTurn}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
