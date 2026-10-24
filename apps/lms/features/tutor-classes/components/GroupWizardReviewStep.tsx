import type { ComponentType, ReactNode } from "react";
import {
  AcademicCapIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MapIcon,
  MapPinIcon,
  PencilSquareIcon,
  SparklesIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/ui/tooltip";

type Icon = ComponentType<{ className?: string }>;
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
const modeLabels: Record<string, string> = { ONLINE: "Trực tuyến", OFFLINE: "Trực tiếp" };
const billingLabels: Record<string, string> = { MONTHLY: "Theo tháng", FULL_COURSE: "Cả khóa" };

function IconTile({ icon: Icon }: { icon: Icon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-primary">
      <Icon className="size-5" />
    </span>
  );
}

function Stat({ icon, label, value, hint }: { icon: Icon; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
      <IconTile icon={icon} />
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="font-lms text-base font-extrabold leading-snug tabular-nums text-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function EditButton({ label, step, onEdit }: { label: string; step: number; onEdit: (step: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onEdit(step)}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-bold text-primary outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
      aria-label={label}
    >
      <PencilSquareIcon className="size-4" aria-hidden="true" />
      Sửa
    </button>
  );
}

function Section({
  icon,
  title,
  step,
  onEdit,
  children,
}: {
  icon: Icon;
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={icon} />
          <h3 className="font-lms text-base font-extrabold text-foreground">{title}</h3>
        </div>
        <EditButton label={`Sửa ${title.toLowerCase()}`} step={step} onEdit={onEdit} />
      </div>
      {children}
    </section>
  );
}

function Chip({ icon: Icon, children }: { icon?: Icon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">
      {Icon && <Icon className="size-3.5 text-primary" />}
      {children}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 rounded-2xl bg-muted px-4 py-3">
      <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

export function GroupWizardReviewStep({ data, onEdit }: { data: GroupDto; onEdit: (step: number) => void }) {
  const lessons = data.roadmap.reduce((sum, stage) => sum + stage.lessons.length, 0);
  const offering = [data.teachingItemName, data.contextName].filter(Boolean).join(" - ");
  const online = data.teachingMode === "ONLINE";
  const shortOfLessons = lessons < data.numberOfSessions;
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Chip icon={online ? VideoCameraIcon : MapPinIcon}>{modeLabels[data.teachingMode ?? ""] ?? "Chưa xác định"}</Chip>
            <Chip icon={BanknotesIcon}>{billingLabels[data.billingMode ?? ""] ?? "Chưa xác định"}</Chip>
            {data.programName && <Chip icon={AcademicCapIcon}>{data.programName}</Chip>}
          </div>
          <EditButton label="Sửa nội dung giảng dạy" step={0} onEdit={onEdit} />
        </div>
        <h3 className="mt-3 font-lms text-xl font-extrabold leading-[1.25] text-foreground">{data.title || "Chưa đặt tên"}</h3>
        {offering && <p className="mt-1 text-sm text-muted-foreground">{offering}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CalendarDaysIcon} label="Khai giảng" value={data.openingAt ? dateTime.format(new Date(data.openingAt)) : "Chưa chọn"} />
        <Stat icon={UserGroupIcon} label="Sĩ số tối đa" value={`${data.capacity} học viên`} />
        <Stat icon={ClockIcon} label="Số buổi" value={`${data.numberOfSessions} buổi`} hint={`${data.sessionDurationMinutes} phút mỗi buổi`} />
        <Stat icon={BanknotesIcon} label="Tổng học phí" value={currency.format(data.totalAmount)} hint={`${currency.format(data.pricePerSession)} mỗi buổi`} />
      </div>

      <div className="-mt-1 flex justify-end">
        <EditButton label="Sửa lịch và học phí" step={2} onEdit={onEdit} />
      </div>

      <Section icon={SparklesIcon} title="Thông tin lớp" step={1} onEdit={onEdit}>
        <dl className="grid gap-2 sm:grid-cols-2">
          <Fact label="Điểm nổi bật" value={data.highlight || "Chưa có"} />
          <Fact label="Địa điểm" value={data.location || (online ? "Học trực tuyến" : "Chưa có")} />
          {data.description && (
            <div className="sm:col-span-2">
              <Fact label="Nội dung lớp" value={data.description} />
            </div>
          )}
        </dl>
      </Section>

      <Section icon={MapIcon} title="Lộ trình" step={3} onEdit={onEdit}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Chip>{data.roadmap.length ? `${data.roadmap.length} chặng · ${lessons} bài` : "Chưa có lộ trình"}</Chip>
          {shortOfLessons && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-8 items-center gap-1 rounded-full border border-accent/40 bg-accent/20 px-2.5 text-xs font-bold text-warning outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExclamationTriangleIcon className="size-4" aria-hidden="true" />
                  Ít hơn số buổi ({lessons}/{data.numberOfSessions})
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Lớp có {data.numberOfSessions} buổi nhưng lộ trình mới có {lessons} bài. Một số buổi sẽ chưa có nội dung bài học tương ứng. Bạn vẫn có thể gửi duyệt hoặc quay lại bước Lộ trình để bổ sung.
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {data.roadmap.length > 0 && (
          <ol className="grid gap-2 sm:grid-cols-2">
            {data.roadmap.map((stage, i) => (
              <li key={stage.id} className="flex items-start gap-3 rounded-2xl bg-muted px-4 py-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold tabular-nums text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{stage.title}</p>
                  <p className="text-xs text-muted-foreground">{stage.lessons.length} bài học</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm">
        <InformationCircleIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-extrabold text-foreground">Sau khi gửi, hệ thống tự chỉ định tư vấn viên duyệt lớp</p>
          <p className="text-muted-foreground">
            Khi lớp được duyệt, bạn bấm Công khai tuyển sinh để lớp xuất hiện ở trang tuyển sinh. Duyệt hoặc công khai không tự khai giảng hay ghi danh học viên.
          </p>
        </div>
      </div>
    </div>
  );
}
