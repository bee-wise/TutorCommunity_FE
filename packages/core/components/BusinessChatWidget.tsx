"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
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
  XCircleIcon as XCircle,
  PencilSquareIcon as PencilSquare,
  BanknotesIcon as Banknotes,
  BookOpenIcon as BookOpen,
  HashtagIcon as Hash,
  UserIcon as User,
  ClipboardDocumentListIcon as ClipboardList,
  Squares2X2Icon as Squares,
} from "@heroicons/react/24/outline";
import { getApiErrorMessage } from "../sys-libs/error-handler";
import {
  connectionWidgetsService,
  type ClassSessionSlot,
} from "../services/connection-widgets.service";
import {
  formatTeachingOfferingName,
  isDraftWidget,
  payloadString,
  type ChatBusinessMessage,
} from "../services/chat-business-message";
import {
  DateTimePicker,
  formatToDatetimeLocalValue,
} from "@workspace/ui/components/ui/date-time-picker";
import { Button } from "@workspace/ui/components/ui/button";
import { PaymentQrCode } from "@workspace/ui/components/PaymentQrCode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { queryKeys } from "../sys-libs/queryKeys";
import { getVietQrBankBin, getVietQrBankName } from "../services/vietqr-bank";
import { TrialJoinButton } from "./TrialJoinButton";

type Role = "CONSULTANT" | "LEARNER" | "TUTOR";
type Props = {
  business: ChatBusinessMessage;
  currentRole: Role;
  roomClosed: boolean;
};

async function refreshChatHistory(queryClient: QueryClient, roomId?: string) {
  if (!roomId) return;
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.chatRooms.messages(roomId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.consultantWorkspace.messages(roomId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.saleChatRooms.messages(roomId),
    }),
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

// Trials no longer need tutor/learner approval; legacy statuses are shown as read-only history.
const trialStatusConfig: Record<string, { label: string; className: string }> =
  {
    SCHEDULED: statusConfig.SCHEDULED!,
    CONFIRMED: statusConfig.SCHEDULED!,
    PROPOSED: {
      label: "Lịch cũ cần xử lý",
      className: "bg-accent/25 text-amber-900 border-accent/30",
    },
    RESCHEDULE_PENDING: {
      label: "Lịch cũ có đề xuất đổi giờ",
      className: "bg-accent/25 text-amber-900 border-accent/30",
    },
    REJECTED: {
      label: "Đã từ chối (lịch sử)",
      className: "bg-muted text-muted-foreground border-border",
    },
  };

const trialCancellableStatuses = new Set([
  "SCHEDULED",
  "CONFIRMED",
  "PROPOSED",
  "RESCHEDULE_PENDING",
]);

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
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
};

type WidgetTone = "primary" | "accent";

const toneStyles: Record<
  WidgetTone,
  { band: string; tile: string; track: string; trackOn: string }
> = {
  primary: {
    band: "bg-primary text-primary-foreground",
    tile: "bg-card text-primary",
    track: "bg-primary-foreground/30",
    trackOn: "bg-primary-foreground",
  },
  accent: {
    band: "bg-accent text-accent-foreground",
    tile: "bg-card text-foreground",
    track: "bg-accent-foreground/20",
    trackOn: "bg-accent-foreground",
  },
};

const journeySteps = ["Học thử", "Xác nhận lớp", "Thanh toán", "Xếp lịch"];

const successStatuses = new Set([
  "CONFIRMED",
  "COMPLETED",
  "PAID",
  "SCHEDULED",
  "ACTIVE",
]);
const dangerStatuses = new Set(["REJECTED", "CANCELLED", "EXPIRED", "FAILED"]);
const warningStatuses = new Set([
  "PROPOSED",
  "RESCHEDULE_PENDING",
  "WAITING_CONFIRMATION",
  "PENDING_CONFIRMATION",
  "PENDING",
  "RESCHEDULED",
]);

function statusDotClass(status: string) {
  if (successStatuses.has(status)) return "bg-secondary";
  if (dangerStatuses.has(status)) return "bg-destructive";
  if (warningStatuses.has(status)) return "bg-accent";
  return "bg-muted-foreground";
}

function JourneySteps({ step, tone }: { step: number; tone: WidgetTone }) {
  const styles = toneStyles[tone];
  return (
    <div
      className="mt-3"
      role="img"
      aria-label={`Bước ${step} trên ${journeySteps.length}: ${journeySteps[step - 1]}`}
    >
      <div className="flex gap-1.5">
        {journeySteps.map((name, index) => (
          <span
            key={name}
            className={`h-1.5 flex-1 rounded-full ${index < step ? styles.trackOn : styles.track}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] font-semibold opacity-90">
        Bước {step}/{journeySteps.length} · {journeySteps[step - 1]}
      </p>
    </div>
  );
}

function Frame({
  icon: Icon,
  title,
  status,
  statusAction,
  statusLabels = statusConfig,
  tone = "primary",
  step,
  children,
}: {
  icon: typeof Sparkle;
  title: string;
  status?: string | null;
  statusAction?: ReactNode;
  statusLabels?: Record<string, { label: string; className: string }>;
  tone?: WidgetTone;
  step?: number;
  children: ReactNode;
}) {
  const currentStatus = status
    ? (statusLabels[status] ?? statusConfig[status])
    : undefined;
  const styles = toneStyles[tone];

  return (
    <section className="w-full max-w-[440px] overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-soft">
      <header className={`px-4 pb-3.5 pt-3.5 ${styles.band}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-xs ${styles.tile}`}
            >
              <Icon width={20} height={20} />
            </div>
            <h3 className="truncate font-nunito text-base font-extrabold leading-tight">
              {title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {status && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11px] font-bold tracking-tight text-foreground shadow-xs">
                <span
                  className={`size-2 rounded-full ${statusDotClass(status)}`}
                  aria-hidden="true"
                />
                {currentStatus?.label ?? status}
              </span>
            )}
            {statusAction}
          </div>
        </div>
        {step && <JourneySteps step={step} tone={tone} />}
      </header>
      <div className="space-y-3 p-4 text-xs">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  highlight = false,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
  icon?: typeof Sparkle;
}) {
  return (
    <div className="flex items-center gap-3 leading-5">
      {Icon && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
          <Icon width={16} height={16} aria-hidden="true" />
        </span>
      )}
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <span className="shrink-0 text-muted-foreground">{label}</span>
        <span
          className={`min-w-0 break-words text-right ${
            highlight
              ? "font-nunito text-[13px] font-extrabold text-primary"
              : "font-semibold text-foreground"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/** Solid primary block that makes the amount the first thing a reader sees. */
function AmountBanner({
  label,
  amount,
  hint,
  muted = false,
}: {
  label: string;
  amount?: number | null;
  hint?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl p-4 shadow-xs ${
        muted
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-semibold opacity-90">{label}</p>
        <p
          className={`font-nunito text-2xl font-black leading-tight tabular-nums ${
            muted ? "line-through" : ""
          }`}
        >
          {money(amount)}
        </p>
        {hint && (
          <p className="mt-0.5 text-[11px] font-medium opacity-90">{hint}</p>
        )}
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Banknotes width={22} height={22} aria-hidden="true" />
      </span>
    </div>
  );
}

/** Calendar-style tile: weekday, big day number and month. */
function DateTile({ value }: { value?: string | null }) {
  const date = value ? new Date(value) : null;
  const valid = !!date && !Number.isNaN(date.getTime());
  const parts = valid
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "short",
        day: "2-digit",
        month: "numeric",
      }).formatToParts(date)
    : [];
  const pick = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return (
    <div className="flex w-14 shrink-0 flex-col items-center overflow-hidden rounded-2xl border border-border bg-card text-center shadow-xs">
      <span className="w-full bg-accent py-0.5 text-[10px] font-extrabold uppercase text-accent-foreground">
        {valid ? pick("weekday") : "—"}
      </span>
      <span className="font-nunito text-xl font-black leading-7 tabular-nums text-foreground">
        {valid ? pick("day") : "--"}
      </span>
      <span className="pb-1 text-[10px] font-bold text-muted-foreground">
        {valid ? `Tháng ${pick("month")}` : ""}
      </span>
    </div>
  );
}

type ProposedSlot = {
  id: string;
  startAt: string;
  endAt: string;
  name?: string;
  description?: string;
  location?: string;
};

const sessionFieldClass =
  "w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

const sessionName = (session: { name?: unknown }) =>
  typeof session.name === "string" && session.name.trim()
    ? session.name.trim()
    : undefined;

const classStatusLabel =(status?: string | null) =>
  ({ ACTIVE: "Đang học", COMPLETED: "Đã hoàn thành", CANCELLED: "Đã hủy" })[
    status ?? ""
  ] ??
  status ??
  "—";

const sessionStatusLabel = (status?: string | null) =>
  ({
    SCHEDULED: "Đã xếp lịch",
    RESCHEDULED: "Đã dời lịch",
    COMPLETED: "Đã học",
    CANCELLED: "Đã hủy",
  })[status ?? ""] ??
  status ??
  "Đã xếp lịch";

const dateOnly = (value?: string | null) => {
  if (!value) return "Chưa xác định";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chưa xác định"
    : new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
};

const timeOnly = (value?: string | null) => {
  if (!value) return "--:--";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "--:--"
    : new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
};

function ConfirmationStatusGroup({
  tutorConfirmedAt,
  learnerConfirmedAt,
}: {
  tutorConfirmedAt?: string | null;
  learnerConfirmedAt?: string | null;
}) {
  const items = [
    { label: "Gia sư", confirmedAt: tutorConfirmedAt },
    { label: "Học viên", confirmedAt: learnerConfirmedAt },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ label, confirmedAt }) => (
        <div
          key={label}
          className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
            confirmedAt ? "border-secondary bg-card" : "border-border bg-muted"
          }`}
        >
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
              confirmedAt
                ? "bg-secondary text-secondary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            {confirmedAt ? (
              <CheckCircle width={16} height={16} />
            ) : (
              <Clock width={16} height={16} />
            )}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[11px] font-bold text-foreground">
              {label}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {confirmedAt ? "Đã xác nhận" : "Chờ xác nhận"}
            </p>
          </div>
        </div>
      ))}
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

function TrialWidget({ business, currentRole, roomClosed }: Props) {
  const id = business.referenceId ?? payloadString(business.payload, "id");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "trial", id],
    queryFn: () => connectionWidgetsService.getTrial(id!),
    enabled: !!id && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const data =
    business.current?.kind === "TRIAL_SESSION"
      ? business.current.data
      : query.data;
  const payload = business.payload;
  const status = data?.status;

  if (currentRole !== "CONSULTANT" && isDraftWidget(status)) {
    return null;
  }

  const joinUrl =
    meetingUrl(data?.zoomUrl) ?? meetingUrl(data?.locationOrMeetingInfo);
  const meetingInfo =
    data?.teachingMode === "OFFLINE"
      ? (data.locationOrMeetingInfo ?? data.zoomUrl)
      : (data?.zoomUrl ?? data?.locationOrMeetingInfo);
  const isOnlineRoom =
    data?.teachingMode === "ONLINE" ||
    (data?.teachingMode !== "OFFLINE" && !!joinUrl);
  const subjectDisplay = formatTeachingOfferingName(data);

  const startValue =
    data?.scheduledStartAt ??
    (business.current ? undefined : payloadString(payload, "scheduledStartAt"));
  const endValue =
    data?.scheduledEndAt ??
    (business.current ? undefined : payloadString(payload, "scheduledEndAt"));
  const scheduledEndAtValue = endValue;
  const scheduledEndTime = scheduledEndAtValue
    ? new Date(scheduledEndAtValue).getTime()
    : NaN;
  const isEnded =
    status !== "CANCELLED" &&
    !Number.isNaN(scheduledEndTime) &&
    scheduledEndTime < Date.now();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelBusy, setCancelBusy] = useState(false);

  async function cancelTrial() {
    if (
      roomClosed ||
      !id ||
      data?.version === undefined ||
      data?.version === null
    )
      return;
    if (!cancelReason.trim()) {
      setCancelError("Vui lòng nhập lý do hủy buổi học thử.");
      return;
    }
    setCancelBusy(true);
    setCancelError("");
    try {
      await connectionWidgetsService.cancelTrial(
        id,
        data.version,
        cancelReason.trim(),
      );
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "trial", id],
      });
      await refreshChatHistory(queryClient, business.roomId);
      setShowCancelModal(false);
      setCancelReason("");
    } catch (caught) {
      setCancelError(getApiErrorMessage(caught));
    } finally {
      setCancelBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[440px]">
      <Frame
        icon={GraduationCap}
        title="Lịch học thử"
        status={status}
        statusLabels={trialStatusConfig}
        step={1}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
          <DateTile value={startValue} />
          <div className="min-w-0 flex-1">
            <p className="font-nunito text-lg font-black leading-tight tabular-nums text-foreground">
              {timeOnly(startValue)} – {timeOnly(endValue)}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-muted-foreground">
              {dateOnly(startValue)}
            </p>
            <span
              className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                data?.teachingMode === "ONLINE"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {data?.teachingMode === "ONLINE" ? (
                <>
                  <VideoCamera width={12} height={12} /> Trực tuyến
                </>
              ) : data?.teachingMode === "OFFLINE" ? (
                <>
                  <MapPin width={12} height={12} /> Trực tiếp
                </>
              ) : (
                "Hình thức chưa xác định"
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <Row icon={BookOpen} label="Môn học" value={subjectDisplay} />
          {meetingInfo && !isOnlineRoom && (
            <Row icon={MapPin} label="Địa điểm" value={meetingInfo} />
          )}
        </div>

        {data && meetingInfo && isOnlineRoom && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <VideoCamera width={20} height={20} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-nunito text-[13px] font-extrabold text-foreground">
                Phòng học trực tuyến
              </p>
              <p className="truncate font-medium text-muted-foreground select-text">
                {meetingInfo}
              </p>
            </div>
            {joinUrl && (
              <TrialJoinButton
                trial={data}
                href={joinUrl}
                disabled={roomClosed}
              />
            )}
          </div>
        )}

        {data?.note && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-muted p-3 text-[11px] leading-relaxed text-muted-foreground">
            <ClipboardList
              width={16}
              height={16}
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              <span className="font-bold text-foreground">Ghi chú: </span>
              {data.note}
            </p>
          </div>
        )}

        {status === "CANCELLED" &&
          (data?.cancellationReason || data?.completionNote) && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-destructive bg-card p-3 text-[11px] leading-relaxed text-foreground">
              <XCircle
                width={16}
                height={16}
                className="mt-0.5 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <p>
                <span className="font-bold text-destructive">Lý do hủy: </span>
                {data.cancellationReason || data.completionNote}
              </p>
            </div>
          )}

        {currentRole === "CONSULTANT" &&
          !!status &&
          trialCancellableStatuses.has(status) &&
          data && (
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCancelReason("");
                  setCancelError("");
                  setShowCancelModal(true);
                }}
                disabled={roomClosed || cancelBusy}
                className="h-10 w-full rounded-full border-destructive text-destructive hover:bg-muted font-nunito text-xs font-bold transition-all active:scale-[0.98]"
              >
                <XCircle width={15} height={15} className="shrink-0" />
                <span>Hủy buổi học thử</span>
              </Button>
            </div>
          )}

        {query.error && (
          <ErrorBanner message={getApiErrorMessage(query.error)} />
        )}

        {currentRole === "CONSULTANT" && (
          <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <DialogContent className="max-w-md rounded-2xl p-5">
              <DialogHeader className="space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle width={20} height={20} className="shrink-0" />
                  <DialogTitle className="font-nunito text-base font-extrabold text-foreground">
                    Hủy buổi học thử
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  Buổi học thử sẽ được chuyển sang trạng thái{" "}
                  <strong>Đã hủy</strong>. Sau đó bạn có thể tạo lịch học thử
                  mới nếu cần.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <label
                  htmlFor="cancel-trial-reason"
                  className="block text-xs font-bold text-foreground"
                >
                  Lý do hủy buổi học thử{" "}
                  <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="cancel-trial-reason"
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (cancelError) setCancelError("");
                  }}
                  placeholder="Nhập lý do hủy (ví dụ: Học viên bận đột xuất, Gia sư xin dời lịch mới...)"
                  className="w-full resize-none rounded-xl border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                  disabled={cancelBusy}
                />
                {cancelError && <ErrorBanner message={cancelError} />}
              </div>

              <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelBusy}
                  className="h-9 rounded-xl px-4 text-xs font-semibold"
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void cancelTrial()}
                  disabled={roomClosed || cancelBusy || !cancelReason.trim()}
                  className="h-9 rounded-xl px-4 text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  {cancelBusy ? (
                    <>
                      <CircleNotch
                        width={14}
                        height={14}
                        className="animate-spin"
                      />
                      <span>Đang hủy...</span>
                    </>
                  ) : (
                    <span>Xác nhận hủy</span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Frame>

      {isEnded && (
        <div
          className="my-3 flex items-center gap-2 w-full select-none"
          role="status"
        >
          <div className="h-px flex-1 bg-border/80" />
          <div
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-card px-3 py-1 text-center text-[11px] font-bold text-amber-900 dark:text-amber-200 shadow-2xs backdrop-blur-xs transition-all ${
              currentRole === "CONSULTANT" && !roomClosed
                ? "cursor-pointer hover:bg-muted active:scale-95"
                : ""
            }`}
            title={
              currentRole === "CONSULTANT" && !roomClosed
                ? "Nhấn để mở công cụ xác nhận lớp học"
                : undefined
            }
            onClick={
              currentRole === "CONSULTANT" && !roomClosed
                ? () => {
                    window.dispatchEvent(
                      new CustomEvent("beewise:open-consultant-widget", {
                        detail: {
                          tab: "confirmation",
                          roomId: business.roomId,
                        },
                      }),
                    );
                  }
                : undefined
            }
          >
            <Clock
              width={14}
              height={14}
              className="shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span className="leading-tight">
              Buổi học thử đã kết thúc, vui lòng đợi tư vấn viên gửi xác nhận
              buổi học.
            </span>
          </div>
          <div className="h-px flex-1 bg-border/80" />
        </div>
      )}
    </div>
  );
}

function ConfirmationWidget({ business, currentRole, roomClosed }: Props) {
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
  const data =
    business.current?.kind === "CLASS_CONFIRMATION"
      ? business.current.data
      : query.data;
  const status = data?.status;

  if (currentRole !== "CONSULTANT" && isDraftWidget(status)) {
    return null;
  }

  const confirmed =
    currentRole === "TUTOR" ? data?.tutorConfirmedAt : data?.learnerConfirmedAt;

  async function confirm() {
    if (
      roomClosed ||
      !id ||
      data?.version === undefined ||
      data?.version === null
    )
      return;
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

  function handleOpenEdit() {
    if (roomClosed) return;
    const confirmationId = data?.id ?? id;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("beewise:open-consultant-widget", {
          detail: {
            tab: "confirmation",
            confirmationId,
            roomId: business.roomId,
          },
        }),
      );
    }
  }

  return (
    <Frame
      icon={FileText}
      title="Xác nhận lớp học"
      tone="accent"
      step={2}
      status={status}
      statusAction={
        isDraftWidget(status) && currentRole === "CONSULTANT" ? (
          <button
            type="button"
            onClick={handleOpenEdit}
            disabled={roomClosed}
            className="inline-flex size-6 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95 shadow-2xs"
            title="Chỉnh sửa điều khoản lớp học"
            aria-label="Chỉnh sửa điều khoản lớp học"
          >
            <PencilSquare width={13} height={13} aria-hidden="true" />
          </button>
        ) : undefined
      }
    >
      <AmountBanner
        label="Tổng học phí"
        amount={data?.totalAmount}
        hint={
          data?.pricePerHour ? `${money(data.pricePerHour)} / giờ` : undefined
        }
      />

      <div className="space-y-2.5">
        <Row
          icon={BookOpen}
          label="Môn học"
          value={formatTeachingOfferingName(data)}
        />
        <Row
          icon={VideoCamera}
          label="Hình thức"
          value={
            data?.teachingMode === "ONLINE"
              ? "Trực tuyến"
              : data?.teachingMode === "OFFLINE"
                ? "Trực tiếp"
                : "Đang thảo luận"
          }
        />
        <Row
          icon={Clock}
          label="Thời lượng"
          value={
            data?.sessionDurationMinutes
              ? `${data.sessionDurationMinutes} phút / buổi`
              : "Đang thảo luận"
          }
        />
        <Row
          icon={Squares}
          label="Số buổi"
          value={
            data?.numberOfSessions
              ? `${data.numberOfSessions} buổi`
              : "Đang thảo luận"
          }
        />
        {data?.proposedSchedule && (
          <Row
            icon={CalendarCheck}
            label="Lịch dự kiến"
            value={data.proposedSchedule}
          />
        )}
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
            disabled={roomClosed || busy || !data}
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

function PaymentWidget({ business, currentRole, roomClosed }: Props) {
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
  const storedData =
    business.current?.kind === "PAYMENT_REQUEST"
      ? business.current.data
      : (createdQuery.data ?? query.data);
  // GET only reads DB; while PENDING the learner polls refresh so PayOS is checked even without a webhook.
  const verify = useQuery({
    queryKey: ["connection-widget", "payment-refresh", storedData?.id],
    queryFn: () => connectionWidgetsService.refreshPayment(storedData!.id),
    enabled:
      currentRole === "LEARNER" &&
      !roomClosed &&
      storedData?.status === "PENDING" &&
      !!storedData.id,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
    retry: false,
  });
  const data = verify.data ?? storedData;
  const verifiedStatus = verify.data?.status;
  useEffect(() => {
    if (!verifiedStatus || verifiedStatus === "PENDING") return;
    void queryClient.invalidateQueries({
      queryKey: ["connection-widget", "payment"],
    });
    void refreshChatHistory(queryClient, business.roomId);
  }, [verifiedStatus, queryClient, business.roomId]);
  const classId =
    data?.classId ?? (business.current ? undefined : classIdFromPayload);
  const checkout = safeCheckout(data?.checkoutUrl);
  const qrCode = data?.qrCode?.trim() ? data.qrCode : null;
  const bankBin =
    data?.bin?.trim() || (qrCode ? getVietQrBankBin(qrCode) : undefined);
  const bankName = data?.bankName?.trim() || getVietQrBankName(bankBin);

  // Show human-readable class details; the raw class id is never displayed.
  const classInfo = data?.classInfo ?? undefined;
  const infoText = (...keys: string[]) => {
    for (const key of keys) {
      const value = classInfo?.[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return undefined;
  };
  const infoNumber = (...keys: string[]) => {
    for (const key of keys) {
      const value = classInfo?.[key];
      if (typeof value === "number" && Number.isFinite(value)) return value;
    }
    return undefined;
  };
  const className = infoText("className", "name", "title");
  const subjectName = formatTeachingOfferingName(
    {
      contextName: infoText("contextName") ?? data?.contextName,
      teachingItemName: infoText("teachingItemName") ?? data?.teachingItemName,
      subjectName: infoText("subjectName") ?? data?.subjectName,
      subject: infoText("subject") ?? data?.subject,
    },
    "",
  );
  const tutorName = infoText("tutorName", "tutorFullName");
  const teachingMode = infoText("teachingMode");
  const sessionCount = infoNumber(
    "numberOfSessions",
    "sessionCount",
    "purchasedSessionCount",
  );
  const sessionMinutes = infoNumber(
    "sessionDurationMinutes",
    "durationMinutes",
  );

  async function create() {
    if (roomClosed || !classId) return;
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

  // A pending request past its deadline is treated as expired right away, before the server flips the status.
  const expiredAtTime = data?.expiredAt ? Date.parse(data.expiredAt) : NaN;
  const isExpired =
    data?.status === "EXPIRED" ||
    (data?.status === "PENDING" &&
      Number.isFinite(expiredAtTime) &&
      expiredAtTime < Date.now());

  return (
    <div className="w-full max-w-[440px] space-y-3">
    <Frame
      icon={Receipt}
      title="Học viên thanh toán"
      status={isExpired ? "EXPIRED" : data?.status}
      step={3}
    >
      <AmountBanner
        label={data?.status === "PAID" ? "Đã thanh toán" : "Số tiền cần đóng"}
        muted={isExpired}
        amount={data?.amount}
        hint={
          data?.expiredAt && data.status !== "PAID"
            ? `Hạn thanh toán ${dateTime(data.expiredAt)}`
            : undefined
        }
      />

      <div className="space-y-2.5">
        {(className ?? subjectName) && (
          <Row
            icon={BookOpen}
            label="Lớp học"
            value={className ?? subjectName}
          />
        )}
        {className && subjectName && className !== subjectName && (
          <Row icon={Squares} label="Môn học" value={subjectName} />
        )}
        {tutorName && <Row icon={User} label="Gia sư" value={tutorName} />}
        {teachingMode && (
          <Row
            icon={VideoCamera}
            label="Hình thức"
            value={
              teachingMode === "ONLINE"
                ? "Trực tuyến"
                : teachingMode === "OFFLINE"
                  ? "Trực tiếp"
                  : teachingMode
            }
          />
        )}
        {sessionCount !== undefined && (
          <Row
            icon={CalendarCheck}
            label="Số buổi"
            value={
              sessionMinutes
                ? `${sessionCount} buổi · ${sessionMinutes} phút/buổi`
                : `${sessionCount} buổi`
            }
          />
        )}
        {data?.orderCode && (
          <Row icon={Hash} label="Mã hóa đơn" value={String(data.orderCode)} />
        )}
        {data?.paidAt && (
          <Row
            icon={CheckCircle}
            label="Thanh toán lúc"
            value={dateTime(data.paidAt)}
          />
        )}
      </div>

      {data?.status === "PENDING" && !isExpired && !roomClosed && qrCode && (
        <PaymentQrCode value={qrCode} bankName={bankName} bankBin={bankBin} />
      )}

      {currentRole === "LEARNER" &&
        data?.status !== "PAID" &&
        !isExpired &&
        !checkout &&
        !qrCode &&
        classId && (
          <Button
            type="button"
            onClick={() => void create()}
            disabled={roomClosed || busy}
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

      {currentRole === "LEARNER" &&
        checkout &&
        data?.status === "PENDING" &&
        !isExpired &&
        (roomClosed ? (
          <Button
            type="button"
            disabled
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all"
          >
            <CreditCard width={15} height={15} />
            <span>Thanh toán ngay qua PayOS</span>
          </Button>
        ) : (
          <Button
            asChild
            className="h-12 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            <a href={checkout} target="_blank" rel="noopener noreferrer">
              <CreditCard width={15} height={15} />
              <span>Thanh toán ngay qua PayOS</span>
              <ArrowRight width={16} height={16} />
            </a>
          </Button>
        ))}

      {(query.error || createdQuery.error) && (
        <ErrorBanner
          message={getApiErrorMessage(query.error ?? createdQuery.error)}
        />
      )}
      {error && <ErrorBanner message={error} />}
    </Frame>

    </div>
  );
}

/** Notice rendered right under the "payment request expired" system message, with a button to get a new link. */
export function PaymentExpiredNotice({
  classId,
  roomId,
  currentRole,
  roomClosed,
}: {
  classId?: string;
  roomId?: string;
  currentRole: Role;
  roomClosed: boolean;
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create() {
    if (roomClosed || !classId) return;
    setBusy(true);
    setError("");
    try {
      await connectionWidgetsService.createPayment(classId);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "payment"],
      });
      await refreshChatHistory(queryClient, roomId);
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      role="status"
      className="mx-auto my-2 w-full max-w-[440px] overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-soft"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Clock width={20} height={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h4 className="font-nunito text-sm font-extrabold text-foreground">
            Yêu cầu thanh toán đã hết hạn
          </h4>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {currentRole === "LEARNER"
              ? "Liên kết và mã QR cũ không còn dùng được. Hãy lấy liên kết mới để tiếp tục thanh toán học phí."
              : "Đang chờ học viên lấy liên kết thanh toán mới."}
          </p>
        </div>
      </div>
      {currentRole === "LEARNER" && classId && (
        <Button
          type="button"
          onClick={() => void create()}
          disabled={roomClosed || busy}
          className="mt-3 h-11 w-full rounded-full font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
        >
          {busy ? (
            <>
              <CircleNotch width={14} height={14} className="animate-spin" />
              <span>Đang tạo liên kết...</span>
            </>
          ) : (
            <>
              <CreditCard width={15} height={15} />
              <span>Lấy lại liên kết thanh toán</span>
            </>
          )}
        </Button>
      )}
      {error && (
        <div className="mt-3">
          <ErrorBanner message={error} />
        </div>
      )}
    </section>
  );
}

function SessionsWidget({ business, currentRole, roomClosed }: Props) {
  const classId =
    business.current?.kind === "CLASS_SCHEDULE"
      ? business.current.data.classId
      : (payloadString(business.payload, "classId") ?? business.referenceId);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["connection-widget", "sessions", classId],
    queryFn: () => connectionWidgetsService.getSessions(classId!),
    enabled: !!classId && !business.current,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const [showForm, setShowForm] = useState(false);
  const [dialogElement, setDialogElement] = useState<HTMLDivElement | null>(
    null,
  );
  // "Lịch dự kiến": slots the tutor proposes from the chat. They are checked with
  // POST /classes/{classId}/sessions/preview; the official sessions are created later in the LMS
  // (POST /classes/{classId}/sessions).
  const [proposed, setProposed] = useState<ProposedSlot[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitKey = useRef<string | null>(null);
  const schedule =
    business.current?.kind === "CLASS_SCHEDULE"
      ? business.current.data
      : undefined;

  if (currentRole !== "CONSULTANT" && isDraftWidget(schedule?.status)) {
    return null;
  }

  const sessions = schedule?.sessions ?? query.data;
  // The planned session count caps how many sessions can be scheduled (cancelled ones free a slot).
  const plannedSessions =
    typeof schedule?.numberOfSessions === "number" &&
    schedule.numberOfSessions > 0
      ? schedule.numberOfSessions
      : undefined;
  const activeSessions = (sessions ?? []).filter(
    (item) => item.status !== "CANCELLED",
  );
  const openPlanned = [...proposed].sort(
    (a, b) => Date.parse(a.startAt) - Date.parse(b.startAt),
  );
  const scheduledCount = activeSessions.length + openPlanned.length;
  const remainingSessions =
    plannedSessions === undefined
      ? undefined
      : Math.max(0, plannedSessions - scheduledCount);
  const limitReached = remainingSessions === 0;
  const durationMinutes =
    typeof schedule?.sessionDurationMinutes === "number" &&
    schedule.sessionDurationMinutes > 0
      ? schedule.sessionDurationMinutes
      : undefined;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (roomClosed || !classId) return;
    if (limitReached) {
      setError(`Lớp đã xếp đủ ${plannedSessions} buổi dự kiến.`);
      return;
    }
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
    setBusy(true);
    setError("");
    const slot: ClassSessionSlot = {
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      locationOrMeetingInfo: location.trim(),
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
    };
    try {
      const preview = await connectionWidgetsService.previewSessions(classId, [
        slot,
      ]);
      if (preview.conflicts.length) {
        setError("Khung giờ này trùng lịch học hiện có. Hãy chọn giờ khác.");
        return;
      }
      setProposed((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          startAt: slot.startAt,
          endAt: slot.endAt,
          name: slot.name,
          description: slot.description,
          location: slot.locationOrMeetingInfo,
        },
      ]);
      await queryClient.invalidateQueries({
        queryKey: ["connection-widget", "sessions", classId],
      });
      await refreshChatHistory(queryClient, business.roomId);
      setShowForm(false);
      setName("");
      setDescription("");
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
      step={4}
      status={
        sessions?.length
          ? `${sessions.length} buổi`
          : openPlanned.length
            ? `${openPlanned.length} lịch dự kiến`
            : "Chờ xếp lịch"
      }
    >
      {schedule && (
        <div className="space-y-2.5">
          <Row
            icon={BookOpen}
            label="Môn học"
            value={formatTeachingOfferingName(schedule)}
          />
          <Row
            icon={ClipboardList}
            label="Trạng thái lớp"
            value={classStatusLabel(schedule.status)}
          />
          <Row
            icon={Squares}
            label="Đã xếp / dự kiến"
            value={
              plannedSessions !== undefined
                ? `${scheduledCount}/${plannedSessions} buổi`
                : (schedule.numberOfSessions ?? "—")
            }
          />
          <Row
            icon={Clock}
            label="Thời lượng mỗi buổi"
            value={
              schedule.sessionDurationMinutes
                ? `${schedule.sessionDurationMinutes} phút`
                : "—"
            }
          />
        </div>
      )}

      {openPlanned.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Lịch dự kiến ({openPlanned.length})
          </p>
          <ul className="space-y-2">
            {openPlanned.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-2.5 text-xs"
              >
                <DateTile value={slot.startAt} />
                <div className="min-w-0 flex-1">
                  {slot.name && (
                    <p className="truncate font-nunito text-[13px] font-extrabold text-foreground">
                      {slot.name}
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-[11px] font-semibold tabular-nums text-foreground">
                    <Clock
                      width={12}
                      height={12}
                      className="shrink-0 text-primary"
                    />
                    {timeOnly(slot.startAt)} – {timeOnly(slot.endAt)}
                  </p>
                  {slot.description && (
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {slot.description}
                    </p>
                  )}
                  {slot.location && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-muted-foreground">
                      <MapPin width={12} height={12} className="shrink-0" />
                      <span className="truncate">{slot.location}</span>
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-primary">
                  Dự kiến
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sessions?.length ? (
        <ol className="space-y-2 pt-1">
          {sessions.map((session, index) => (
            <li
              key={session.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 text-xs shadow-xs"
            >
              <DateTile value={session.startAt} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-nunito text-[13px] font-extrabold text-foreground">
                    {sessionName(session) ?? `Buổi ${index + 1}`}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-primary">
                    {sessionStatusLabel(session.status)}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold tabular-nums text-foreground">
                  <Clock
                    width={12}
                    height={12}
                    className="shrink-0 text-primary"
                  />
                  {timeOnly(session.startAt)} – {timeOnly(session.endAt)}
                </p>
                {typeof session.description === "string" &&
                  session.description.trim() && (
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {session.description}
                    </p>
                  )}
                {session.locationOrMeetingInfo && (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-muted-foreground">
                    <MapPin width={12} height={12} className="shrink-0" />
                    <span className="truncate">
                      {session.locationOrMeetingInfo}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : openPlanned.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-background/50 py-4 text-center text-muted-foreground">
          Chưa có buổi học nào được xếp.
        </p>
      ) : null}

      {currentRole === "TUTOR" &&
        classId &&
        (!schedule || schedule.status === "ACTIVE") && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
            disabled={roomClosed || limitReached}
            className="h-12 w-full rounded-full border-primary/40 font-nunito text-xs font-bold text-primary transition-all hover:border-primary hover:bg-muted active:scale-[0.98]"
          >
            <CalendarPlus width={14} height={14} />
            <span>
              {limitReached
                ? `Đã xếp đủ ${plannedSessions} buổi`
                : remainingSessions !== undefined
                  ? `Xếp thêm buổi học (còn ${remainingSessions} buổi)`
                  : "Xếp thêm buổi học"}
            </span>
          </Button>
        )}

      <Dialog
        open={showForm && !roomClosed}
        onOpenChange={(open) => {
          if (!busy) setShowForm(open);
        }}
      >
        <DialogContent
          ref={setDialogElement}
          className="w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-visible rounded-3xl border-border bg-card p-0 shadow-pop [&>button]:right-4 [&>button]:top-4 [&>button]:size-8 [&>button]:rounded-xl [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:p-0 [&>button]:text-foreground [&>button]:opacity-100 [&>button]:transition-all [&>button]:hover:bg-muted [&>button]:active:scale-95 [&>button]:flex [&>button]:items-center [&>button]:justify-center"
        >
          {/* Clip the blue header to the rounded corners; the date picker portals to the dialog root, outside this wrapper. */}
          <div className="overflow-hidden rounded-[inherit]">
          <DialogHeader className="bg-primary px-5 py-4 pr-14 text-left text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-xs">
                <CalendarPlus width={20} height={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="font-nunito text-base font-extrabold text-primary-foreground">
                  Xếp lịch dự kiến
                </DialogTitle>
                <DialogDescription className="text-xs text-primary-foreground">
                  {remainingSessions !== undefined
                    ? `Còn ${remainingSessions}/${plannedSessions} buổi có thể xếp.`
                    : "Thêm một buổi học mới vào lịch của lớp."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(event) => void submit(event)}
            className="space-y-4 p-5"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="session-name"
                className="block text-xs font-bold text-foreground"
              >
                Tên buổi học
              </label>
              <input
                id="session-name"
                type="text"
                maxLength={200}
                placeholder="VD: Buổi 3 - Ôn tập ngữ pháp"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={sessionFieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="session-description"
                className="block text-xs font-bold text-foreground"
              >
                Mô tả
              </label>
              <textarea
                id="session-description"
                rows={3}
                maxLength={2000}
                placeholder="Nội dung, tài liệu hoặc việc học viên cần chuẩn bị..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={`${sessionFieldClass} resize-none`}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  Bắt đầu <span className="text-destructive">*</span>
                </label>
                <DateTimePicker
                  value={startAt}
                  onChange={(nextVal) => {
                    submitKey.current = null;
                    setStartAt(nextVal);
                    // End time follows the start time by the class's minutes per session.
                    if (durationMinutes) {
                      const start = new Date(nextVal);
                      setEndAt(
                        nextVal && !Number.isNaN(start.getTime())
                          ? formatToDatetimeLocalValue(
                              new Date(start.getTime() + durationMinutes * 60_000),
                            )
                          : "",
                      );
                    }
                  }}
                  minDate={new Date()}
                  placeholder="Chọn ngày và giờ"
                  side="bottom"
                  align="start"
                  portalContainer={dialogElement}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  Kết thúc{" "}
                  {durationMinutes ? (
                    <span className="font-medium text-muted-foreground">
                      (tự tính: {durationMinutes} phút/buổi)
                    </span>
                  ) : (
                    <span className="text-destructive">*</span>
                  )}
                </label>
                <DateTimePicker
                  disabled={!!durationMinutes}
                  value={endAt}
                  onChange={(nextVal) => {
                    submitKey.current = null;
                    setEndAt(nextVal);
                  }}
                  minDate={
                    startAt
                      ? new Date(new Date(startAt).getTime() + 60_000)
                      : new Date()
                  }
                  placeholder="Chọn ngày và giờ"
                  side="bottom"
                  align="end"
                  portalContainer={dialogElement}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="session-location"
                className="block text-xs font-bold text-foreground"
              >
                Địa điểm / Liên kết phòng học
              </label>
              <input
                id="session-location"
                type="text"
                placeholder="VD: Phòng Zoom, Google Meet hoặc địa chỉ..."
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={sessionFieldClass}
              />
            </div>

            <p className="flex items-start gap-2 rounded-2xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              <Sparkle
                width={16}
                height={16}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <span className="font-bold text-foreground">Mẹo: </span>
                Bạn có thể xếp lịch này sau trong LMS, ở mục Lịch dạy.
              </span>
            </p>

            {error && <ErrorBanner message={error} />}

            <DialogFooter className="flex flex-row justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={busy}
                className="h-10 rounded-full px-5 text-xs font-bold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={roomClosed || busy || limitReached}
                className="h-10 rounded-full px-5 font-nunito text-xs font-extrabold transition-all active:scale-[0.98]"
              >
                {busy ? (
                  <>
                    <CircleNotch
                      width={14}
                      height={14}
                      className="animate-spin"
                    />
                    <span>Đang lưu lịch...</span>
                  </>
                ) : (
                  <>
                    <Check width={14} height={14} />
                    <span>Thêm lịch dự kiến</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {query.error && <ErrorBanner message={getApiErrorMessage(query.error)} />}
      {error && !showForm && <ErrorBanner message={error} />}
    </Frame>
  );
}

export function BusinessChatWidget(props: Props) {
  if (
    props.currentRole !== "CONSULTANT" &&
    isDraftWidget(props.business.current?.data?.status)
  ) {
    return null;
  }

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
