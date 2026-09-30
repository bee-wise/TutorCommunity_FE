"use client";

import type { ReactNode, ElementType } from "react";
import {
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  ListChecksIcon,
  MapPinIcon,
  MonitorIcon,
  WarningCircleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import type {
  ChatWidget as ChatWidgetType,
  ChatParticipantRole,
} from "../types/messages.types";

type TrialWidget = Extract<ChatWidgetType, { widgetType: "TRIAL_SESSION" }>;
type ClassWidget = Extract<
  ChatWidgetType,
  { widgetType: "CLASS_CONFIRMATION" }
>;
type PaymentWidget = Extract<ChatWidgetType, { widgetType: "PAYMENT_REQUEST" }>;
type ScheduleWidget = Extract<
  ChatWidgetType,
  { widgetType: "SCHEDULE_CLASSES" }
>;

interface ChatWidgetProps {
  widget: ChatWidgetType;
  currentRole: ChatParticipantRole;
}

const money = (amount: number) => `${amount.toLocaleString("vi-VN")} ₫`;

const dateTime = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const time = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function WidgetFrame({
  icon: Icon,
  title,
  reference,
  status,
  tone = "primary",
  children,
  footer,
}: {
  icon: ElementType;
  title: string;
  reference: string;
  status: string;
  tone?: "primary" | "success" | "warning";
  children: ReactNode;
  footer?: ReactNode;
}) {
  const statusStyle =
    tone === "success"
      ? "bg-secondary text-secondary-foreground"
      : tone === "warning"
        ? "bg-accent text-accent-foreground"
        : "bg-primary text-primary-foreground";

  return (
    <section className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <header className="flex flex-wrap items-start gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusStyle}`}
        >
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="min-w-[120px] flex-1">
          <h3 className="font-nunito text-sm font-extrabold text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {reference}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle}`}
        >
          {status}
        </span>
      </header>
      <div className="space-y-3 px-4 py-4 sm:px-5">{children}</div>
      {footer && (
        <footer className="border-t border-border bg-muted px-4 py-3 sm:px-5">
          {footer}
        </footer>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs leading-5">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function Confirmation({
  label,
  confirmed,
}: {
  label: string;
  confirmed: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
        confirmed
          ? "border-secondary bg-secondary text-secondary-foreground"
          : "border-border bg-card text-muted-foreground"
      }`}
    >
      {confirmed ? (
        <CheckCircleIcon size={14} aria-hidden="true" />
      ) : (
        <ClockIcon size={14} aria-hidden="true" />
      )}
      {label}: {confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
    </span>
  );
}

function MockAction({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[11px] text-muted-foreground"></span>
      <button
        type="button"
        disabled
        className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground opacity-55 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </div>
  );
}

function TrialSessionWidget({
  widget,
  currentRole,
}: {
  widget: TrialWidget;
  currentRole: ChatParticipantRole;
}) {
  const data = widget.data;
  const statusLabels = {
    PROPOSED: "Chờ hai bên",
    CONFIRMED: "Đã xác nhận",
    REJECTED: "Đã từ chối",
    CANCELLED: "Đã hủy",
    COMPLETED: "Đã hoàn thành",
  };
  const needsAction =
    data.status === "PROPOSED" &&
    ((currentRole === "LEARNER" && !data.confirmedByLearnerAt) ||
      (currentRole === "TUTOR" && !data.confirmedByTutorAt));

  return (
    <WidgetFrame
      icon={CalendarCheckIcon}
      title="Lịch học thử"
      reference={`Mã đề xuất ${data.id}`}
      status={statusLabels[data.status]}
      tone={
        data.status === "COMPLETED" || data.status === "CONFIRMED"
          ? "success"
          : "warning"
      }
      footer={needsAction ? <MockAction label="Xác nhận lịch" /> : undefined}
    >
      <div className="rounded-xl bg-muted px-3.5 py-3">
        <p className="font-nunito text-base font-extrabold text-primary">
          {dateTime(data.startAt)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Kết thúc {time(data.endAt)} ·{" "}
          {data.teachingMode === "ONLINE" ? "Học trực tuyến" : "Học trực tiếp"}
        </p>
      </div>
      {(data.location || data.meetingInfo) && (
        <p className="flex items-start gap-2 text-xs leading-5 text-foreground">
          {data.teachingMode === "ONLINE" ? (
            <MonitorIcon
              size={16}
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            />
          ) : (
            <MapPinIcon
              size={16}
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            />
          )}
          {data.location || data.meetingInfo}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Confirmation label="Gia sư" confirmed={!!data.confirmedByTutorAt} />
        <Confirmation
          label="Học viên"
          confirmed={!!data.confirmedByLearnerAt}
        />
      </div>
    </WidgetFrame>
  );
}

function ClassConfirmationWidget({
  widget,
  currentRole,
}: {
  widget: ClassWidget;
  currentRole: ChatParticipantRole;
}) {
  const data = widget.data;
  const labels = {
    DRAFT: "Bản nháp",
    WAITING_CONFIRMATION: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
  };
  const needsAction =
    data.status === "WAITING_CONFIRMATION" &&
    ((currentRole === "LEARNER" && !data.learnerConfirmedAt) ||
      (currentRole === "TUTOR" && !data.tutorConfirmedAt));

  return (
    <WidgetFrame
      icon={ListChecksIcon}
      title="Xác nhận lớp học"
      reference={`Gói gia sư ${data.tutorOfferingId}`}
      status={labels[data.status]}
      tone={data.status === "CONFIRMED" ? "success" : "primary"}
      footer={
        needsAction ? <MockAction label="Xác nhận điều kiện" /> : undefined
      }
    >
      <Detail label="Môn học" value={data.subject} />
      <Detail
        label="Hình thức"
        value={data.teachingMode === "ONLINE" ? "Trực tuyến" : "Trực tiếp"}
      />
      <Detail
        label="Thời lượng"
        value={`${data.sessionDurationMinutes} phút / buổi`}
      />
      <Detail label="Số buổi" value={`${data.numberOfSessions} buổi`} />
      <Detail label="Học phí" value={`${money(data.pricePerSession)} / buổi`} />
      {data.proposedSchedule && (
        <Detail label="Lịch dự kiến" value={data.proposedSchedule} />
      )}
      <div className="border-t border-border pt-3">
        <Detail
          label="Tổng học phí"
          value={
            <strong className="font-nunito text-base font-black text-primary">
              {money(data.totalAmount)}
            </strong>
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Confirmation label="Gia sư" confirmed={!!data.tutorConfirmedAt} />
        <Confirmation label="Học viên" confirmed={!!data.learnerConfirmedAt} />
      </div>
      <p className="text-[11px] leading-4 text-muted-foreground">
        Điều kiện thay đổi sẽ cần hai bên xác nhận lại.
      </p>
    </WidgetFrame>
  );
}

function PaymentRequestWidget({
  widget,
  currentRole,
}: {
  widget: PaymentWidget;
  currentRole: ChatParticipantRole;
}) {
  const data = widget.data;
  const labels = {
    PENDING: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán lỗi",
    EXPIRED: "Hết hạn",
    CANCELLED: "Đã hủy",
  };
  const canPay =
    data.status === "PENDING" &&
    currentRole === "LEARNER" &&
    !!data.checkoutUrl?.startsWith("https://");

  return (
    <WidgetFrame
      icon={CreditCardIcon}
      title="Thanh toán lớp học"
      reference={`Lớp ${data.classId} · Mã ${data.orderCode}`}
      status={labels[data.status]}
      tone={
        data.status === "PAID"
          ? "success"
          : data.status === "PENDING"
            ? "warning"
            : "primary"
      }
      footer={
        data.status === "PENDING" && currentRole === "LEARNER" ? (
          canPay ? (
            <a
              href={data.checkoutUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
            >
              Thanh toán qua PayOS{" "}
              <ArrowSquareOutIcon size={14} aria-hidden="true" />
            </a>
          ) : (
            <MockAction label="Thanh toán qua PayOS" />
          )
        ) : undefined
      }
    >
      <Detail label="Gia sư" value={data.tutorName} />
      <Detail label="Môn học" value={data.subject} />
      <Detail label="Số buổi" value={`${data.numberOfSessions} buổi`} />
      <div className="rounded-xl bg-muted px-3.5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Số tiền cần thanh toán
        </p>
        <p className="font-nunito mt-1 text-xl font-black text-primary">
          {money(data.amount)}
        </p>
      </div>
      {data.status === "PAID" ? (
        <p className="flex items-center gap-2 text-xs font-semibold text-secondary">
          <CheckCircleIcon size={17} aria-hidden="true" /> Thanh toán thành công
          lúc {data.paidAt ? dateTime(data.paidAt) : "—"}
        </p>
      ) : (
        <>
          <Detail label="Hạn thanh toán" value={dateTime(data.expiredAt)} />
          {data.status === "PENDING" && !data.checkoutUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted px-3 py-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
                <CreditCardIcon size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Mã QR / liên kết PayOS
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                  Sẽ hiển thị khi PayOS phát hành yêu cầu.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </WidgetFrame>
  );
}

function ScheduleClassesWidget({
  widget,
  currentRole,
}: {
  widget: ScheduleWidget;
  currentRole: ChatParticipantRole;
}) {
  const data = widget.data;
  const scheduled = data.sessions.filter(
    (session) =>
      session.status === "SCHEDULED" || session.status === "COMPLETED",
  );
  const remaining = Math.max(0, data.numberOfSessions - scheduled.length);
  const statusLabels = {
    AWAITING_TUTOR: "Chờ gia sư xếp lịch",
    PARTIALLY_SCHEDULED: "Đang xếp lịch",
    SCHEDULED: "Đã xếp lịch",
  };

  return (
    <WidgetFrame
      icon={CalendarCheckIcon}
      title="Lịch các buổi học"
      reference={`Lớp ${data.classId}`}
      status={statusLabels[data.status]}
      tone={data.status === "SCHEDULED" ? "success" : "primary"}
      footer={
        remaining > 0 && currentRole === "TUTOR" ? (
          <MockAction label="Xếp lịch học" />
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-muted px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Đã xếp</p>
          <p className="font-nunito text-lg font-black text-primary">
            {scheduled.length} buổi
          </p>
        </div>
        <div className="rounded-xl bg-muted px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Còn lại</p>
          <p className="font-nunito text-lg font-black text-primary">
            {remaining} buổi
          </p>
        </div>
      </div>
      {scheduled.length > 0 ? (
        <ol className="space-y-2" aria-label="Các buổi học đã xếp">
          {scheduled.slice(0, 3).map((session, index) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-xs"
            >
              <span className="font-semibold text-foreground">
                Buổi {index + 1}
              </span>
              <span className="text-muted-foreground">
                {dateTime(session.startAt)} – {time(session.endAt)}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-muted-foreground">
          Gia sư chưa xếp buổi học nào cho lớp này.
        </p>
      )}
      <p className="text-[11px] leading-4 text-muted-foreground">
        Lịch chính thức sẽ được kiểm tra trùng giờ trước khi lưu.
      </p>
    </WidgetFrame>
  );
}

export function ChatWidget({ widget, currentRole }: ChatWidgetProps) {
  switch (widget.widgetType) {
    case "TRIAL_SESSION":
      return <TrialSessionWidget widget={widget} currentRole={currentRole} />;
    case "CLASS_CONFIRMATION":
      return (
        <ClassConfirmationWidget widget={widget} currentRole={currentRole} />
      );
    case "PAYMENT_REQUEST":
      return <PaymentRequestWidget widget={widget} currentRole={currentRole} />;
    case "SCHEDULE_CLASSES":
      return (
        <ScheduleClassesWidget widget={widget} currentRole={currentRole} />
      );
    case "CLOSE_CONNECTION":
      return (
        <WidgetFrame
          icon={WarningCircleIcon}
          title="Kết nối đã đóng"
          reference="Phòng chat chỉ đọc"
          status="Đã đóng"
        >
          <p className="text-xs leading-5 text-muted-foreground">
            Tư vấn viên đã đóng kết nối này. Nội dung cuộc trò chuyện vẫn được
            lưu để bạn xem lại.
          </p>
        </WidgetFrame>
      );
  }
}
