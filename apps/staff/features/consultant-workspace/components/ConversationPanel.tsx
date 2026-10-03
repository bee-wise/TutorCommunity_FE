"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ChevronDown,
  Info,
  LayoutTemplate,
  Lock,
  Send,
  Sparkles,
  UsersRound,
  XCircle,
} from "lucide-react";
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
import {
  closeReasons,
  messageTemplates,
  widgetPreviews,
} from "../data/workspace-options";
import { initials, shouldShowSessionDivider } from "../utils/format";
import {
  participantName,
  type WorkspaceMessage,
  type WorkspaceRoom,
} from "../types/workspace";
import { RoomDetails } from "./RoomDetails";
import { MessageBubble, SessionTimeDivider } from "./MessageBubble";

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
  const [tool, setTool] = useState<"templates" | "widgets" | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [reason, setReason] = useState<string>("OTHER");
  const [note, setNote] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, room.id]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void submitMessage();
    }
  }

  async function submitMessage() {
    const content = draft.trim();
    if (!content || sending || readOnly) return;
    setActionError(null);
    try {
      await onSend(content);
      setDraft("");
      setTool(null);
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
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      aria-label="Nội dung cuộc trò chuyện"
    >
      {/* Top Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft className="size-5" />
          </button>

          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
              room.kind === "group"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/15 text-secondary"
            }`}
          >
            {room.kind === "group" ? (
              <UsersRound className="size-5" />
            ) : (
              initials(title)
            )}
          </span>

          <div className="min-w-0">
            <h2 className="truncate font-nunito text-sm font-extrabold text-foreground sm:text-base">
              {title}
            </h2>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`hidden rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${
              readOnly
                ? "bg-muted text-muted-foreground"
                : "bg-secondary/15 text-secondary"
            }`}
          >
            {readOnly ? "Đã đóng" : "Đang hỗ trợ"}
          </span>

          {/* Button mở Modal Thông tin hỗ trợ */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            aria-label="Xem thông tin hỗ trợ"
            title="Xem thông tin hỗ trợ"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <Info className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Thông tin hỗ trợ</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setShowClose(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <XCircle className="size-4" />
              <span className="hidden sm:inline">Đóng chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Info alerts */}
      {room.isMock && (
        <div className="shrink-0 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
          Bản xem thử chat riêng · thao tác chỉ lưu cục bộ tại trình duyệt.
        </div>
      )}

      {readOnly && (
        <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Phòng đã đóng. Bạn có thể xem lại lịch
          sử tin nhắn nhưng không thể gửi thêm.
        </div>
      )}

      {/* Messages area */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-3 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-1">
          {hasOlder && (
            <div className="flex justify-center pb-2">
              <button
                type="button"
                disabled={loadingOlder}
                onClick={onLoadOlder}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-xs disabled:opacity-50"
              >
                {loadingOlder ? "Đang tải..." : "Xem tin nhắn cũ hơn"}
              </button>
            </div>
          )}

          {loading && (
            <p className="py-10 text-center text-xs text-muted-foreground">
              Đang tải tin nhắn...
            </p>
          )}

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-card p-3 text-center text-xs text-destructive"
            >
              {getApiErrorMessage(error)}{" "}
              <button
                type="button"
                onClick={onRetry}
                className="ml-1 font-semibold underline"
              >
                Thử lại
              </button>
            </div>
          ) : null}

          {!loading && !error && messages.length === 0 && (
            <div className="py-14 text-center text-xs text-muted-foreground">
              <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="size-5" />
              </span>
              Chưa có tin nhắn trong phòng này.
            </div>
          )}

          {messages.map((message, idx) => {
            const prev = messages[idx - 1];
            const next = messages[idx + 1];

            const isNewSession =
              !prev ||
              prev.isSystem ||
              shouldShowSessionDivider(message.createdAt, prev.createdAt, 2);

            const isConsecutive =
              !isNewSession &&
              prev &&
              prev.senderId === message.senderId &&
              !prev.isSystem &&
              !message.isSystem;

            const isNextNewSession =
              next &&
              shouldShowSessionDivider(next.createdAt, message.createdAt, 2);

            const isLastInTurn =
              !next ||
              next.isSystem ||
              next.senderId !== message.senderId ||
              isNextNewSession;

            const sender = room.participants.find(
              (person) => person.id === message.senderId,
            );

            return (
              <div key={message.id}>
                {isNewSession && !message.isSystem && (
                  <SessionTimeDivider timestamp={message.createdAt} />
                )}

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

      {/* Input area */}
      {!readOnly && (
        <div className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
          <div className="mx-auto max-w-3xl">
            {tool && (
              <div className="mb-3 rounded-xl border border-border bg-muted/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <strong className="text-xs font-bold text-foreground">
                    {tool === "templates"
                      ? "Mẫu tin nhắn hỗ trợ"
                      : "Widget tiện ích · Sắp ra mắt"}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setTool(null)}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Thu gọn
                  </button>
                </div>
                {tool === "templates" ? (
                  <div className="grid gap-1.5">
                    {messageTemplates.map((template) => (
                      <button
                        type="button"
                        key={template}
                        onClick={() => {
                          setDraft(template);
                          setTool(null);
                        }}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-left text-xs leading-5 text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-1.5 sm:grid-cols-3">
                    {widgetPreviews.map((widget) => (
                      <div
                        key={widget.title}
                        className="rounded-lg border border-dashed border-border bg-card p-2.5"
                      >
                        <p className="text-xs font-semibold text-foreground">
                          {widget.title}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {widget.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="mr-auto text-xs font-semibold text-muted-foreground">
                Soạn tin nhắn
              </span>
              <button
                type="button"
                onClick={() =>
                  setTool(tool === "templates" ? null : "templates")
                }
                aria-expanded={tool === "templates"}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  tool === "templates"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/30"
                }`}
              >
                <LayoutTemplate className="size-3.5" /> Tin nhắn mẫu{" "}
                <ChevronDown className="size-3" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setTool(tool === "widgets" ? null : "widgets")
                }
                aria-expanded={tool === "widgets"}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  tool === "widgets"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/30"
                }`}
              >
                <Sparkles className="size-3.5" /> Widget{" "}
                <span className="rounded bg-amber-500/10 px-1 text-[10px] text-amber-700 dark:text-amber-400">
                  Sắp có
                </span>
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submitMessage();
              }}
              className="flex items-end gap-2 rounded-xl border border-input bg-card p-2 shadow-xs focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10"
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Nội dung tin nhắn</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Nhập tin nhắn hỗ trợ..."
                  className="max-h-36 min-h-12 w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                aria-label="Gửi tin nhắn"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Nhấn Enter để gửi · Shift + Enter để xuống dòng
              {room.isMock ? " · Bản xem thử không lưu dữ liệu" : ""}
            </p>

            {actionError ? (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {actionError}
              </p>
            ) : null}
          </div>
        </div>
      )}

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
                className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
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
                className="mt-1.5 w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Thêm bối cảnh cho lần hỗ trợ sau..."
              />
            </label>
            {actionError ? (
              <p role="alert" className="text-xs text-destructive">
                {actionError}
              </p>
            ) : null}
            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowClose(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={closing}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {closing ? "Đang đóng..." : "Xác nhận đóng"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
