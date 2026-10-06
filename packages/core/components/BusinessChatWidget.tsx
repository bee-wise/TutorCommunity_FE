"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarBlank,
  CalendarCheck,
  CalendarPlus,
  ChalkboardTeacher,
  Check,
  CheckCircle,
  CircleNotch,
  Clock,
  CreditCard,
  GraduationCap,
  MapPin,
  Sparkle,
  User,
  VideoCamera,
  WarningCircle,
  ArrowSquareOut,
  FileText,
  Receipt,
} from "@phosphor-icons/react";
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

type Role = "CONSULTANT" | "LEARNER" | "TUTOR";
type Props = { business: ChatBusinessMessage; currentRole: Role };

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
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
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
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  PENDING_CONFIRMATION: {
    label: "Chờ xác nhận",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  PENDING: {
    label: "Chờ thanh toán",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
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
    className: "bg-primary/10 text-primary border-primary/25",
  },
  RESCHEDULED: {
    label: "Đã dời lịch",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
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
    <section className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:border-border/80">
      <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={16} weight="bold" />
          </div>
          <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
            {title}
          </h3>
        </div>
        {status && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight ${
              currentStatus?.className ??
              "bg-primary/10 text-primary border-primary/20"
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
          <CheckCircle size={14} weight="fill" className="shrink-0" />
        ) : (
          <Clock size={14} weight="bold" className="shrink-0 opacity-70" />
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
          <CheckCircle size={14} weight="fill" className="shrink-0" />
        ) : (
          <Clock size={14} weight="bold" className="shrink-0 opacity-70" />
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
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive"
    >
      <WarningCircle size={16} weight="bold" className="shrink-0 mt-0.5" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

function TrialWidget({ business, currentRole }: Props) {
  const id = business.referenceId ?? payloadString(business.payload, "id");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "trial", id],
    queryFn: () => connectionWidgetsService.getTrial(id!),
    enabled: !!id,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = query.data;
  const payload = business.payload;
  const status = data?.status ?? payloadString(payload, "status");
  const confirmed =
    currentRole === "TUTOR" ? data?.tutorConfirmedAt : data?.learnerConfirmedAt;

  async function confirm() {
    if (!id || data?.version === undefined) return;
    setBusy(true);
    setError("");
    try {
      await connectionWidgetsService.confirmTrial(id, data.version);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "trial", id],
      });
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
          value={data?.subject ?? payloadString(payload, "subject") ?? "—"}
        />
        <Row
          label="Bắt đầu"
          value={dateTime(
            data?.scheduledStartAt ??
              payloadString(payload, "scheduledStartAt"),
          )}
        />
        <Row
          label="Kết thúc"
          value={dateTime(
            data?.scheduledEndAt ?? payloadString(payload, "scheduledEndAt"),
          )}
        />
        <Row
          label="Hình thức"
          value={
            data?.teachingMode === "ONLINE" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <VideoCamera size={13} weight="bold" /> Trực tuyến
              </span>
            ) : data?.teachingMode === "OFFLINE" ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} weight="bold" /> Trực tiếp
              </span>
            ) : (
              "—"
            )
          }
        />
        {(data?.locationOrMeetingInfo || data?.zoomUrl) && (
          <Row
            label="Địa điểm / Liên kết"
            value={
              data.zoomUrl ? (
                <a
                  href={data.zoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Tham gia phòng học <ArrowSquareOut size={12} />
                </a>
              ) : (
                data.locationOrMeetingInfo
              )
            }
          />
        )}
      </div>

      {data?.note && (
        <div className="rounded-xl border border-border/80 bg-background p-2.5 text-foreground leading-relaxed">
          <span className="font-semibold text-muted-foreground block text-[11px] mb-0.5">
            Ghi chú:
          </span>
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
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={busy || !data}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                <span>Đang xác nhận...</span>
              </>
            ) : (
              <>
                <Check size={14} weight="bold" />
                <span>Xác nhận lịch học thử</span>
              </>
            )}
          </button>
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
    enabled: !!id,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = query.data;
  const status = data?.status ?? payloadString(business.payload, "status");
  const confirmed =
    currentRole === "TUTOR" ? data?.tutorConfirmedAt : data?.learnerConfirmedAt;

  async function confirm() {
    if (!id || data?.version === undefined) return;
    setBusy(true);
    setError("");
    try {
      await connectionWidgetsService.confirmClassConfirmation(id, data.version);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "confirmation", id],
      });
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
            payloadString(business.payload, "subjectName") ??
            "—"
          }
        />
        <Row
          label="Hình thức"
          value={
            data?.teachingMode === "ONLINE" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <VideoCamera size={13} weight="bold" /> Trực tuyến
              </span>
            ) : data?.teachingMode === "OFFLINE" ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} weight="bold" /> Trực tiếp
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
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={busy || !data}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                <span>Đang xác nhận...</span>
              </>
            ) : (
              <>
                <Check size={14} weight="bold" />
                <span>Xác nhận điều khoản lớp học</span>
              </>
            )}
          </button>
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
    enabled: !!id,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [createdId, setCreatedId] = useState<string>();
  const createdQuery = useQuery({
    queryKey: ["connection-widget", "payment", createdId],
    queryFn: () => connectionWidgetsService.getPayment(createdId!),
    enabled: !!createdId,
    refetchInterval: 30_000,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const data = createdQuery.data ?? query.data;
  const classId = data?.classId ?? classIdFromPayload;
  const checkout = safeCheckout(data?.checkoutUrl);

  async function create() {
    if (!classId) return;
    setBusy(true);
    setError("");
    try {
      const created = await connectionWidgetsService.createPayment(classId);
      setCreatedId(created.id);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "payment"],
      });
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
      status={data?.status ?? payloadString(business.payload, "status")}
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
          <button
            type="button"
            onClick={() => void create()}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                <span>Đang tạo liên kết...</span>
              </>
            ) : (
              <>
                <CreditCard size={15} weight="bold" />
                <span>Lấy liên kết thanh toán</span>
              </>
            )}
          </button>
        )}

      {currentRole === "LEARNER" && checkout && data?.status === "PENDING" && (
        <a
          href={checkout}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98]"
        >
          <CreditCard size={15} weight="bold" />
          <span>Thanh toán ngay qua PayOS</span>
          <ArrowSquareOut size={13} weight="bold" />
        </a>
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
  const classId =
    payloadString(business.payload, "classId") ?? business.referenceId;
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "sessions", classId],
    queryFn: () => connectionWidgetsService.getSessions(classId!),
    enabled: !!classId,
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
      status={query.data?.length ? `${query.data.length} buổi` : "Chờ xếp lịch"}
    >
      <Row label="Mã lớp học" value={classId ?? "—"} />

      {query.data?.length ? (
        <ol className="space-y-2 pt-1">
          {query.data.map((session, index) => (
            <li
              key={session.id}
              className="rounded-xl border border-border/80 bg-background p-3 text-xs transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between gap-2 font-semibold">
                <span className="font-nunito font-extrabold text-foreground">
                  Buổi {index + 1}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {session.status ?? "Đã xếp lịch"}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-muted-foreground text-[11px]">
                <Clock size={12} weight="bold" />
                <span>
                  {dateTime(session.startAt)} – {dateTime(session.endAt)}
                </span>
              </div>
              {session.locationOrMeetingInfo && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-foreground/80 font-medium truncate">
                  <MapPin size={12} weight="bold" className="shrink-0" />
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

      {currentRole === "TUTOR" && classId && (
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-card px-4 py-2 font-nunito font-bold text-xs text-primary shadow-2xs transition-all hover:bg-primary/5 hover:border-primary active:scale-[0.98] cursor-pointer"
        >
          {showForm ? (
            <span>Đóng biểu mẫu</span>
          ) : (
            <>
              <CalendarPlus size={14} weight="bold" />
              <span>Xếp thêm buổi học</span>
            </>
          )}
        </button>
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
              className="w-full rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                <span>Đang kiểm tra trùng lịch...</span>
              </>
            ) : (
              <>
                <Check size={14} weight="bold" />
                <span>Xác nhận & Thêm buổi học</span>
              </>
            )}
          </button>
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
