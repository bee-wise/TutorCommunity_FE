"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  CalendarDaysIcon as CalendarCheck,
  CalendarDaysIcon as CalendarPlus,
  CheckIcon as Check,
  CheckCircleIcon as CheckCircle,
  ArrowPathIcon as CircleNotch,
  ClockIcon as Clock,
  CreditCardIcon as CreditCard,
  AcademicCapIcon as GraduationCap,
  MapPinIcon as MapPin,
  SparklesIcon as Sparkle,
  VideoCameraIcon as VideoCamera,
  ExclamationCircleIcon as WarningCircle,
  ArrowRightIcon as ArrowRight,
  DocumentTextIcon as FileText,
  ReceiptPercentIcon as Receipt,
} from "@heroicons/react/24/outline";
import { getApiErrorMessage } from "../sys-libs/error-handler";
import {
  connectionWidgetsService,
  type ClassSessionSlot,
} from "../services/connection-widgets.service";
import {
  payloadString,
  type ChatBusinessMessage,
} from "../services/chat-business-message";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";
import { Button } from "@workspace/ui/components/ui/button";
import { queryKeys } from "../sys-libs/queryKeys";
import { TrialJoinButton } from "./TrialJoinButton";

type Role = "CONSULTANT" | "LEARNER" | "TUTOR";
type Props = { business: ChatBusinessMessage; currentRole: Role };

async function refreshChatHistory(queryClient: QueryClient, roomId?: string) {
  if (!roomId) return;
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.messages(roomId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.consultantWorkspace.messages(roomId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.saleChatRooms.messages(roomId) }),
  ]);
}

const dateTime = (value?: string | null) => {
  if (!value) return "Chưa xác định";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chưa xác định"
    : new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
};

const money = (value?: number | null) =>
  typeof value === "number"
    ? `${value.toLocaleString("vi-VN")} ₫`
    : "Chưa xác định";

const statusConfig: Record<string, { label: string; className: string }> = {
  PROPOSED: {
    label: "Chờ xác nhận",
    className: "bg-accent/25 text-amber-900 border-accent/30",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  DRAFT: {
    label: "Bản nháp",
    className: "bg-muted text-muted-foreground border-border",
  },
  WAITING_CONFIRMATION: {
    label: "Chờ xác nhận",
    className: "bg-accent/25 text-amber-900 border-accent/30",
  },
  PENDING_CONFIRMATION: {
    label: "Chờ xác nhận",
    className: "bg-accent/25 text-amber-900 border-accent/30",
  },
  PENDING: {
    label: "Chờ thanh toán",
    className: "bg-accent/25 text-amber-900 border-accent/30",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  EXPIRED: {
    label: "Hết hạn",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  FAILED: {
    label: "Thanh toán lỗi",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  SCHEDULED: {
    label: "Đã xếp lịch",
    className: "bg-card text-primary border-primary/25",
  },
  RESCHEDULED: {
    label: "Đã dời lịch",
    className: "bg-accent/25 text-amber-900 border-accent/30",
  },
};

const safeCheckout = (value?: string | null) => {
  if (!value) return undefined;
  try {
    return new URL(value).protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
};

const meetingUrl = (value?: string | null) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

function Frame({
  icon: Icon,
  title,
  status,
  children,
}: {
  icon: typeof Sparkle;
  title: string;
  status?: string | null;
  children: ReactNode;
}) {
  const currentStatus = status ? statusConfig[status] : undefined;

  return (
    <section className="w-full max-w-[440px] overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-soft">
      <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Icon width={16} height={16} />
          </div>
          <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
            {title}
          </h3>
        </div>
        {status && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight ${
              currentStatus?.className ??
              "bg-card text-primary border-primary/25"
            }`}
          >
            {currentStatus?.label ?? status}
          </span>
        )}
      </header>
      <div className="space-y-3 p-4 text-xs">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 leading-5">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={`min-w-0 text-right break-words ${
          highlight
            ? "font-nunito font-extrabold text-primary text-[13px]"
            : "font-semibold text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ConfirmationStatusGroup({
  tutorConfirmedAt,
  learnerConfirmedAt,
}: {
  tutorConfirmedAt?: string | null;
  learnerConfirmedAt?: string | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      <div
        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
          tutorConfirmedAt
            ? "border-secondary/30 bg-secondary/10 text-secondary"
            : "border-border bg-background text-muted-foreground"
        }`}
      >
        {tutorConfirmedAt ? (
          <CheckCircle width={14} height={14} className="shrink-0" />
        ) : (
          <Clock width={14} height={14} className="shrink-0 opacity-70" />
        )}
        <span className="truncate">
          Gia sư: {tutorConfirmedAt ? "Đã duyệt" : "Chờ"}
        </span>
      </div>

      <div
        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
          learnerConfirmedAt
            ? "border-secondary/30 bg-secondary/10 text-secondary"
            : "border-border bg-background text-muted-foreground"
        }`}
      >
        {learnerConfirmedAt ? (
          <CheckCircle width={14} height={14} className="shrink-0" />
        ) : (
          <Clock width={14} height={14} className="shrink-0 opacity-70" />
        )}
        <span className="truncate">
          Học viên: {learnerConfirmedAt ? "Đã duyệt" : "Chờ"}
        </span>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 rounded-xl border border-destructive/25 bg-destructive/10 p-2.5 text-[11px] font-medium text-destructive"
    >
      <WarningCircle width={14} height={14} className="shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function TrialWidget({ business, currentRole }: Props) {
  const id = business.referenceId ?? payloadString(business.payload, "id");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "trial", id],
    queryFn: () => connectionWidgetsService.getTrial(id!),
    enabled: !!id && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = business.current?.kind === "TRIAL_SESSION" ? business.current.data : query.data;
  const payload = business.payload;
  const status = data?.status;
  const joinUrl = meetingUrl(data?.zoomUrl ?? data?.locationOrMeetingInfo);
  const confirmed =
    currentRole === "TUTOR" ? data?.tutorConfirmedAt : data?.learnerConfirmedAt;

  async function confirm() {
    if (!id || data?.version === undefined || data?.version === null) return;
    setBusy(true);
    setError("");
    try {
      await connectionWidgetsService.confirmTrial(id, data.version);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "trial", id],
      });
      await refreshChatHistory(queryClient, business.roomId);
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame icon={GraduationCap} title="Đề xuất lịch học thử" status={status}>
      <div className="space-y-2 border-b border-border/60 pb-3">
        <Row
          label="Môn học"
          value={data?.subject ?? (business.current ? undefined : payloadString(payload, "subject")) ?? "—"}
        />
        <Row
          label="Bắt đầu"
          value={dateTime(
            data?.scheduledStartAt ??
              (business.current ? undefined : payloadString(payload, "scheduledStartAt")),
          )}
        />
        <Row
          label="Kết thúc"
          value={dateTime(
            data?.scheduledEndAt ??
              (business.current ? undefined : payloadString(payload, "scheduledEndAt")),
          )}
        />
        <Row
          label="Hình thức"
          value={
            data?.teachingMode === "ONLINE" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <VideoCamera width={13} height={13} /> Trực tuyến
              </span>
            ) : data?.teachingMode === "OFFLINE" ? (
              <span className="inline-flex items-center gap-1">
                <MapPin width={13} height={13} /> Trực tiếp
              </span>
            ) : (
              "—"
            )
          }
        />
        {(data?.locationOrMeetingInfo || data?.zoomUrl) && (
          <Row
            label="Địa điểm / Phòng học"
            value={data.locationOrMeetingInfo ?? data.zoomUrl}
          />
        )}
      </div>

      {data && joinUrl && <TrialJoinButton trial={data} href={joinUrl} />}

      {data?.note && (

        <div className="rounded-xl border border-border/80 bg-background p-2.5 text-muted-foreground text-[11px] leading-relaxed">
          <span className="font-semibold text-foreground">Ghi chú: </span>
          {data.note}
        </div>
      )}

      <ConfirmationStatusGroup
        tutorConfirmedAt={data?.tutorConfirmedAt}
        learnerConfirmedAt={data?.learnerConfirmedAt}
      />

      {status === "PROPOSED" &&
        (currentRole === "TUTOR" || currentRole === "LEARNER") &&
        !confirmed && (
          <Button
            type="button"
            onClick={() => void confirm()}
            disabled={busy || !data}
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            {busy ? (
              <>
                <CircleNotch width={14} height={14} className="animate-spin" />
                <span>Đang xác nhận...</span>
              </>
            ) : (
              <>
                <Check width={14} height={14} />
                <span>Xác nhận lịch học thử</span>
              </>
            )}
          </Button>
        )}

      {query.error && <ErrorBanner message={getApiErrorMessage(query.error)} />}
      {error && <ErrorBanner message={error} />}
    </Frame>
  );
}

function ConfirmationWidget({ business, currentRole }: Props) {
  const id = business.referenceId ?? payloadString(business.payload, "id");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "confirmation", id],
    queryFn: () => connectionWidgetsService.getClassConfirmation(id!),
    enabled: !!id && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = business.current?.kind === "CLASS_CONFIRMATION" ? business.current.data : query.data;
  const status = data?.status;
  const confirmed =
    currentRole === "TUTOR" ? data?.tutorConfirmedAt : data?.learnerConfirmedAt;

  async function confirm() {
    if (!id || data?.version === undefined || data?.version === null) return;
    setBusy(true);
    setError("");
    try {
      await connectionWidgetsService.confirmClassConfirmation(id, data.version);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "confirmation", id],
      });
      await refreshChatHistory(queryClient, business.roomId);
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame icon={FileText} title="Xác nhận lớp học" status={status}>
      <div className="space-y-2 border-b border-border/60 pb-3">
        <Row
          label="Môn học"
          value={
            data?.subjectName ??
            (business.current ? undefined : payloadString(business.payload, "subjectName")) ??
            "—"
          }
        />
        <Row
          label="Hình thức"
          value={
            data?.teachingMode === "ONLINE" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <VideoCamera width={13} height={13} /> Trực tuyến
              </span>
            ) : data?.teachingMode === "OFFLINE" ? (
              <span className="inline-flex items-center gap-1">
                <MapPin width={13} height={13} /> Trực tiếp
              </span>
            ) : (
              "—"
            )
          }
        />
        <Row
          label="Thời lượng"
          value={
            data?.sessionDurationMinutes
              ? `${data.sessionDurationMinutes} phút / buổi`
              : "—"
          }
        />
        <Row
          label="Số buổi"
          value={data?.numberOfSessions ? `${data.numberOfSessions} buổi` : "—"}
        />
        <Row label="Học phí mỗi giờ" value={money(data?.pricePerHour)} />
        <Row label="Tổng học phí" value={money(data?.totalAmount)} highlight />
        {data?.proposedSchedule && (
          <Row label="Lịch dự kiến" value={data.proposedSchedule} />
        )}
        {data?.classId && <Row label="Mã lớp học" value={data.classId} />}
      </div>

      <ConfirmationStatusGroup
        tutorConfirmedAt={data?.tutorConfirmedAt}
        learnerConfirmedAt={data?.learnerConfirmedAt}
      />

      {(status === "WAITING_CONFIRMATION" ||
        status === "PENDING_CONFIRMATION" ||
        status === "PROPOSED") &&
        (currentRole === "TUTOR" || currentRole === "LEARNER") &&
        !confirmed && (
          <Button
            type="button"
            onClick={() => void confirm()}
            disabled={busy || !data}
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            {busy ? (
              <>
                <CircleNotch width={14} height={14} className="animate-spin" />
                <span>Đang xác nhận...</span>
              </>
            ) : (
              <>
                <Check width={14} height={14} />
                <span>Xác nhận điều khoản lớp học</span>
              </>
            )}
          </Button>
        )}

      {query.error && <ErrorBanner message={getApiErrorMessage(query.error)} />}
      {error && <ErrorBanner message={error} />}
    </Frame>
  );
}

function PaymentWidget({ business, currentRole }: Props) {
  const id = business.referenceId ?? payloadString(business.payload, "id");
  const classIdFromPayload = payloadString(business.payload, "classId");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "payment", id],
    queryFn: () => connectionWidgetsService.getPayment(id!),
    enabled: !!id && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [createdId, setCreatedId] = useState<string>();
  const createdQuery = useQuery({
    queryKey: ["connection-widget", "payment", createdId],
    queryFn: () => connectionWidgetsService.getPayment(createdId!),
    enabled: !!createdId && !business.current,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = business.current?.kind === "PAYMENT_REQUEST" ? business.current.data : createdQuery.data ?? query.data;
  const classId = data?.classId ?? (business.current ? undefined : classIdFromPayload);
  const checkout = safeCheckout(data?.checkoutUrl);

  async function create() {
    if (!classId) return;
    setBusy(true);
    setError("");
    try {
      const created = await connectionWidgetsService.createPayment(classId);
      if (!business.current) setCreatedId(created.id);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "payment"],
      });
      await refreshChatHistory(queryClient, business.roomId);
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame
      icon={Receipt}
      title="Học viên thanh toán"
      status={data?.status}
    >
      <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-2">
        <Row label="Lớp học" value={classId ?? "—"} />
        <Row label="Số tiền cần đóng" value={money(data?.amount)} highlight />
        {data?.orderCode && (
          <Row label="Mã đơn hàng" value={String(data.orderCode)} />
        )}
        {data?.expiredAt && (
          <Row label="Hạn thanh toán" value={dateTime(data.expiredAt)} />
        )}
        {data?.paidAt && (
          <Row label="Đã thanh toán" value={dateTime(data.paidAt)} />
        )}
      </div>

      {currentRole === "LEARNER" &&
        data?.status !== "PAID" &&
        (data?.status === "EXPIRED" || !checkout) &&
        classId && (
          <Button
            type="button"
            onClick={() => void create()}
            disabled={busy}
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            {busy ? (
              <>
                <CircleNotch width={14} height={14} className="animate-spin" />
                <span>Đang tạo liên kết...</span>
              </>
            ) : (
              <>
                <CreditCard width={15} height={15} />
                <span>Lấy liên kết thanh toán</span>
              </>
            )}
          </Button>
        )}

      {currentRole === "LEARNER" && checkout && data?.status === "PENDING" && (
        <Button
          asChild
          className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
        >
          <a
            href={checkout}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CreditCard width={15} height={15} />
            <span>Thanh toán ngay qua PayOS</span>
            <ArrowRight width={16} height={16} />
          </a>
        </Button>
      )}

      {(query.error || createdQuery.error) && (
        <ErrorBanner
          message={getApiErrorMessage(query.error ?? createdQuery.error)}
        />
      )}
      {error && <ErrorBanner message={error} />}
    </Frame>
  );
}

function SessionsWidget({ business, currentRole }: Props) {
  const classId = business.current?.kind === "CLASS_SCHEDULE"
    ? business.current.data.classId
    : payloadString(business.payload, "classId") ?? business.referenceId;
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "sessions", classId],
    queryFn: () => connectionWidgetsService.getSessions(classId!),
    enabled: !!classId && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [showForm, setShowForm] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitKey = useRef<string | null>(null);
  const schedule = business.current?.kind === "CLASS_SCHEDULE" ? business.current.data : undefined;
  const sessions = schedule?.sessions ?? query.data;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!classId) return;
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (
      !startAt ||
      !endAt ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start ||
      start.toDateString() !== end.toDateString()
    ) {
      setError("Hãy chọn giờ bắt đầu và kết thúc hợp lệ trong cùng một ngày.");
      return;
    }
    const sessions: ClassSessionSlot[] = [
      {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        locationOrMeetingInfo: location.trim(),
      },
    ];
    setBusy(true);
    setError("");
    try {
      const preview = await connectionWidgetsService.previewSessions(
        classId,
        sessions,
      );
      if (preview.conflicts.length) {
        setError("Khung giờ này trùng lịch học hiện có. Hãy chọn giờ khác.");
        return;
      }
      submitKey.current ??= crypto.randomUUID();
      await connectionWidgetsService.createSessions(
        classId,
        sessions,
        submitKey.current,
      );
      submitKey.current = null;
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "sessions", classId],
      });
      await refreshChatHistory(queryClient, business.roomId);
      setShowForm(false);
      setStartAt("");
      setEndAt("");
      setLocation("");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame
      icon={CalendarCheck}
      title="Lịch các buổi học"
      status={sessions?.length ? `${sessions.length} buổi` : "Chờ xếp lịch"}
    >
      <Row label="Mã lớp học" value={classId ?? "—"} />
      {schedule && (
        <div className="space-y-1 rounded-xl border border-border/80 bg-background p-3">
          <Row label="Môn học" value={schedule.subjectName ?? "—"} />
          <Row label="Trạng thái lớp" value={schedule.status ?? "—"} />
          <Row label="Số buổi dự kiến" value={schedule.numberOfSessions ?? "—"} />
          <Row label="Thời lượng mỗi buổi" value={schedule.sessionDurationMinutes ? `${schedule.sessionDurationMinutes} phút` : "—"} />
        </div>
      )}

      {sessions?.length ? (
        <ol className="space-y-2 pt-1">
          {sessions.map((session, index) => (
            <li
              key={session.id}
              className="rounded-xl border border-border/80 bg-background p-3 text-xs transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between gap-2 font-semibold">
                <span className="font-nunito font-extrabold text-foreground">
                  Buổi {index + 1}
                </span>
                <span className="rounded-full border border-primary/25 bg-card px-2 py-0.5 text-[10px] font-bold text-primary">
                  {session.status ?? "Đã xếp lịch"}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-muted-foreground text-[11px]">
                <Clock width={12} height={12} />
                <span>
                  {dateTime(session.startAt)} – {dateTime(session.endAt)}
                </span>
              </div>
              {session.locationOrMeetingInfo && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-foreground/80 font-medium truncate">
                  <MapPin width={12} height={12} className="shrink-0" />
                  <span className="truncate">
                    {session.locationOrMeetingInfo}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-background/50 py-4 text-center text-muted-foreground">
          Chưa có buổi học nào được xếp.
        </p>
      )}

      {currentRole === "TUTOR" && classId && (!schedule || schedule.status === "ACTIVE") && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowForm((value) => !value)}
          className="h-12 w-full rounded-full border-primary/40 font-nunito text-xs font-bold text-primary transition-all hover:border-primary hover:bg-muted active:scale-[0.98]"
        >
          {showForm ? (
            <span>Đóng biểu mẫu</span>
          ) : (
            <>
              <CalendarPlus width={14} height={14} />
              <span>Xếp thêm buổi học</span>
            </>
          )}
        </Button>
      )}

      {showForm && (
        <form
          onSubmit={(event) => void submit(event)}
          className="space-y-3 rounded-xl border border-border bg-background p-3.5"
        >
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-foreground">
              Bắt đầu <span className="text-destructive">*</span>
            </label>
            <DateTimePicker
              value={startAt}
              onChange={(nextVal) => {
                submitKey.current = null;
                setStartAt(nextVal);
              }}
              placeholder="dd/mm/yyyy hh:mm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-foreground">
              Kết thúc <span className="text-destructive">*</span>
            </label>
            <DateTimePicker
              value={endAt}
              onChange={(nextVal) => {
                submitKey.current = null;
                setEndAt(nextVal);
              }}
              placeholder="dd/mm/yyyy hh:mm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-foreground">
              Địa điểm / Liên kết phòng học
            </label>
            <input
              type="text"
              placeholder="VD: Phòng Zoom, Google Meet hoặc địa chỉ..."
              value={location}
              onChange={(event) => {
                submitKey.current = null;
                setLocation(event.target.value);
              }}
              className="w-full rounded-2xl border border-input bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            {busy ? (
              <>
                <CircleNotch width={14} height={14} className="animate-spin" />
                <span>Đang kiểm tra trùng lịch...</span>
              </>
            ) : (
              <>
                <Check width={14} height={14} />
                <span>Xác nhận & Thêm buổi học</span>
              </>
            )}
          </Button>
        </form>
      )}

      {query.error && <ErrorBanner message={getApiErrorMessage(query.error)} />}
      {error && <ErrorBanner message={error} />}
    </Frame>
  );
}

export function BusinessChatWidget(props: Props) {
  switch (props.business.kind) {
    case "TRIAL_SESSION":
      return <TrialWidget {...props} />;
    case "CLASS_CONFIRMATION":
      return <ConfirmationWidget {...props} />;
    case "PAYMENT_REQUEST":
      return <PaymentWidget {...props} />;
    case "CLASS_SESSIONS":
      return <SessionsWidget {...props} />;
  }
}
