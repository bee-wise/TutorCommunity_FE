"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import {
  ClockIcon as Clock,
  UserIcon as User,
  CheckIcon as Check,
  DocumentDuplicateIcon as Copy,
  InformationCircleIcon as Info,
  CheckBadgeIcon as CheckCheck,
  HashtagIcon as Hash,
  DocumentTextIcon as FileText,
} from "@heroicons/react/24/outline";
import type { ChatMessage, ChatParticipantRole } from "../types/messages.types";
import { formatFullDateTime, formatRelativeTime, formatFileSize } from "../constants/messages.utils";

const ROLE_LABELS: Record<ChatParticipantRole, string> = {
  TUTOR: "Gia sư",
  LEARNER: "Học viên",
  CONSULTANT: "Tư vấn viên",
};

const MESSAGE_TYPE_LABELS: Record<ChatMessage["type"], string> = {
  TEXT: "Tin nhắn văn bản",
  IMAGE: "Hình ảnh đính kèm",
  FILE: "Tập tin đính kèm",
  WIDGET: "Tiện ích tương tác",
  SYSTEM: "Thông báo hệ thống",
};

interface MessageDetailsDialogProps {
  message: ChatMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function MessageDetailsDialog({
  message,
  open,
  onOpenChange,
  currentUserId,
}: MessageDetailsDialogProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!message) return null;

  const isMine = message.senderId === currentUserId;

  const handleCopyText = async () => {
    if (!message.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(message.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-4 sm:rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Info width={18} height={18} className="text-primary" />
            Chi tiết tin nhắn
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Xem thông tin chi tiết về người gửi, mốc thời gian và trạng thái tin nhắn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {/* Sender info */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                <User width={15} height={15} />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {isMine ? `${message.senderName} (Bạn)` : message.senderName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ROLE_LABELS[message.senderRole] ?? message.senderRole}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground border border-border">
              {MESSAGE_TYPE_LABELS[message.type]}
            </span>
          </div>

          {/* Time info */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <Clock width={15} height={15} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{formatFullDateTime(message.createdAt)}</p>
                <p className="text-muted-foreground">{formatRelativeTime(message.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Content info */}
          {message.text && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <FileText width={13} height={13} />
                  Nội dung:
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:underline"
                >
                  {copiedText ? (
                    <>
                      <Check width={12} height={12} className="text-emerald-500" /> Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy width={12} height={12} /> Sao chép
                    </>
                  )}
                </button>
              </div>
              <div className="max-h-36 overflow-y-auto rounded-xl border border-border bg-muted/30 p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text">
                {message.text}
              </div>
            </div>
          )}

          {/* Attachment info if exists */}
          {message.attachment && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Tệp đính kèm:</span>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-2.5 text-xs">
                <div className="min-w-0 flex-1 truncate">
                  <p className="font-medium text-foreground truncate">{message.attachment.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(message.attachment.size)}</p>
                </div>
                <a
                  href={message.attachment.url}
                  download={message.attachment.name}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 shrink-0 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:brightness-95"
                >
                  Tải về
                </a>
              </div>
            </div>
          )}

          {/* Status & Message ID */}
          <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCheck width={14} height={14} className={message.isRead ? "text-primary" : "text-muted-foreground"} />
              <span>{message.isRead ? "Đã xem" : "Đã gửi"}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              title={`Mã tin nhắn: ${message.id}`}
              className="flex items-center gap-1 text-[11px] hover:text-foreground"
            >
              <Hash width={12} height={12} />
              {copiedId ? "Đã copy ID" : "Copy ID"}
            </button>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl bg-muted px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted/80"
          >
            Đóng
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
