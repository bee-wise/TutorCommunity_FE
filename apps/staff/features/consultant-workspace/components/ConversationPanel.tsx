"use client";

import { useState, type FormEvent } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  InformationCircleIcon as Info,
  LockClosedIcon as Lock,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { closeReasons } from "../data/workspace-options";
import {
  participantName,
  type WorkspaceMessage,
  type WorkspaceRoom,
} from "../types/workspace";
import { RoomDetails } from "./RoomDetails";
import { ConversationComposer } from "./ConversationComposer";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationTimeline } from "./ConversationTimeline";
import { ConsultantWidgetTools } from "./ConsultantWidgetTools";

interface ConversationPanelProps {
  room: WorkspaceRoom;
  messages: WorkspaceMessage[];
  consultantId: string;
  loading: boolean;
  error: unknown;
  sending: boolean;
  closing: boolean;
  hasOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
  onSend: (content: string) => Promise<void>;
  onClose: (reason: string, note?: string) => Promise<void>;
  onBack: () => void;
}

export function ConversationPanel({
  room,
  messages,
  consultantId,
  loading,
  error,
  sending,
  closing,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  onRetry,
  onSend,
  onClose,
  onBack,
}: ConversationPanelProps) {
  const [draft, setDraft] = useState("");
  const [showWidgets, setShowWidgets] = useState(false);
  const [widgetDialogElement, setWidgetDialogElement] = useState<HTMLDivElement | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [reason, setReason] = useState<string>("OTHER");
  const [note, setNote] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const readOnly = room.status !== "ACTIVE";

  const learner = participantName(room, "LEARNER");
  const tutor = participantName(room, "TUTOR");
  const peer =
    room.kind === "private"
      ? room.participants.find((person) => person.role !== "CONSULTANT")
      : null;

  const title =
    room.kind === "group"
      ? `${learner} · ${tutor}`
      : peer?.name ?? "Tư vấn riêng";

  const subtitle =
    room.kind === "group"
      ? `Học viên: ${learner} | Gia sư: ${tutor}`
      : peer?.role === "TUTOR"
        ? "Hỗ trợ riêng cho gia sư"
        : "Hỗ trợ riêng cho học viên";

  async function submitMessage() {
    const content = draft.trim();
    if (!content || sending || readOnly) return;
    setActionError(null);
    try {
      await onSend(content);
      setDraft("");
    } catch (caught) {
      setActionError(getApiErrorMessage(caught, "Không gửi được tin nhắn."));
    }
  }

  async function submitClose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(null);
    try {
      await onClose(reason, note.trim() || undefined);
      setShowClose(false);
      toast.success(
        room.isMock ? "Đã đóng phiên minh họa" : "Đã đóng phòng chat",
      );
    } catch (caught) {
      setActionError(
        getApiErrorMessage(caught, "Không đóng được phòng chat."),
      );
    }
  }

  return (
    <section
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
      aria-label="Nội dung cuộc trò chuyện"
    >
      <ConversationHeader
        room={room}
        title={title}
        subtitle={subtitle}
        readOnly={readOnly}
        onBack={onBack}
        onInfo={() => setShowInfoModal(true)}
        onClose={() => {
          setActionError(null);
          setShowClose(true);
        }}
      />

      {/* Info alerts */}
      {room.isMock && (
        <div className="shrink-0 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
          Bản xem thử chat riêng · thao tác chỉ lưu cục bộ tại trình duyệt.
        </div>
      )}

      {readOnly && (
        <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
           <Lock width={14} height={14} /> Phòng đã đóng. Bạn có thể xem lại lịch
          sử tin nhắn nhưng không thể gửi thêm.
        </div>
      )}

      <ConversationTimeline
        room={room}
        messages={messages}
        consultantId={consultantId}
        loading={loading}
        error={error}
        hasOlder={hasOlder}
        loadingOlder={loadingOlder}
        onLoadOlder={onLoadOlder}
        onRetry={onRetry}
      />

      {!readOnly && (
        <ConversationComposer
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => void submitMessage()}
          onOpenWidgets={() => setShowWidgets(true)}
          sending={sending}
          isMock={room.isMock}
          error={actionError}
        />
      )}

      <Dialog open={showWidgets} onOpenChange={setShowWidgets}>
        <DialogContent ref={setWidgetDialogElement} className="flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[900px] flex-col gap-0 overflow-visible rounded-3xl border-border bg-background p-0 shadow-soft [&>button]:right-4 [&>button]:top-4 [&>button]:rounded-xl [&>button]:border [&>button]:border-border [&>button]:bg-background [&>button]:p-2 [&>button]:transition-all [&>button]:active:scale-[0.98]">
          <DialogHeader className="shrink-0 rounded-t-3xl border-b border-border bg-card px-4 py-3 pr-16 text-left sm:px-6 sm:py-4 sm:pr-16">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <SparklesIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <DialogTitle className="font-nunito text-base font-extrabold leading-[1.2] text-foreground">
                  Widget cho phòng chat
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed">
                  Chọn nội dung cần gửi vào cuộc trò chuyện này.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto rounded-b-3xl p-3 sm:p-5">
            {room.isMock || room.kind !== "group" ? (
              <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft">
                Widget chỉ dùng trong phòng chat kết nối ba bên.
              </p>
            ) : (
              <ConsultantWidgetTools
                roomId={room.id}
                calendarPortalContainer={widgetDialogElement}
                onSent={() => {
                  onRetry();
                  setShowWidgets(false);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Thông tin hỗ trợ (Modal) */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-nunito">
              <Info className="size-4.5 text-primary" />
              Thông tin hỗ trợ
            </DialogTitle>
            <DialogDescription>
              Chi tiết phòng trò chuyện và các thành viên tham gia kết nối.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <RoomDetails room={room} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog đóng chat */}
      <Dialog open={showClose} onOpenChange={setShowClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đóng cuộc trò chuyện</DialogTitle>
            <DialogDescription>
              Phòng sẽ chuyển sang chế độ chỉ đọc. Chọn lý do để lưu cùng lịch
              sử hỗ trợ.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => void submitClose(event)}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold text-foreground">
              Lý do đóng
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none transition-all focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {closeReasons.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-foreground">
              Ghi chú (tùy chọn)
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none transition-all focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                placeholder="Thêm bối cảnh cho lần hỗ trợ sau..."
              />
            </label>
            {actionError ? (
              <p role="alert" className="text-xs text-destructive">
                {actionError}
              </p>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowClose(false)}
                className="h-9 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={closing}
                className="h-9 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98]"
              >
                {closing ? "Đang đóng..." : "Xác nhận đóng"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
