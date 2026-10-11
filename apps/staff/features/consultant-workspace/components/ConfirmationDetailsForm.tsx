import {
  CheckIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@workspace/ui/components/ui/collapsible";
import type { ConsultantWidgetModel } from "../hooks/useConsultantWidgetTools";
import { formatTeachingOfferingName } from "@workspace/core/services/chat-business-message";
import {
  TeachingModeToggle,
  WidgetField,
  widgetFieldClass,
} from "./WidgetFormParts";

export function ConfirmationDetailsForm({
  model,
  busy,
}: {
  model: ConsultantWidgetModel["confirmation"];
  busy: boolean;
}) {
  const selected = model.selected;
  if (!selected) return null;

  const durationNum = Number(model.duration) || 60;
  const sessionsNum = Number(model.sessions) || 1;
  const hourlyRate = selected.pricePerHour;
  const estimatedTotal =
    hourlyRate != null
      ? Math.round(hourlyRate * (durationNum / 60) * sessionsNum)
      : selected.totalAmount;

  return (
    <form
      onSubmit={(event) => void model.updateConfirmation(event)}
      className="space-y-3 rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-4 lg:p-5"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <DocumentTextIcon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-nunito text-base font-extrabold leading-tight text-foreground">
              Chi tiết điều khoản lớp học
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {formatTeachingOfferingName(selected) !== "—"
                ? formatTeachingOfferingName(selected)
                : selected.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground font-mono">
            v{selected.version ?? 1}
          </span>
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {selected.status ?? "DRAFT"}
          </span>
        </div>
      </div>

      {/* Summary card with tuition estimation */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/30 p-2.5 sm:grid-cols-3">
        <div className="min-w-0">
          <span className="block text-[11px] font-medium text-muted-foreground">
            Môn học
          </span>
          <span className="block truncate text-xs font-bold text-foreground">
            {formatTeachingOfferingName(selected) !== "—"
              ? formatTeachingOfferingName(selected)
              : "Chưa xác định"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-muted-foreground">
            Đơn giá
          </span>
          <span className="block text-xs font-bold text-foreground">
            {hourlyRate
              ? `${hourlyRate.toLocaleString("vi-VN")} ₫/giờ`
              : "Theo gói"}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[11px] font-medium text-muted-foreground">
            Học phí dự kiến
          </span>
          <span className="block font-nunito text-xs font-extrabold text-primary">
            {estimatedTotal
              ? `${estimatedTotal.toLocaleString("vi-VN")} ₫`
              : "Chưa xác định"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-3.5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <TeachingModeToggle
          label="Hình thức lớp học"
          value={model.classMode}
          onChange={model.setClassMode}
          className="col-span-1"
        />
        <WidgetField
          id="confirmation-duration"
          label="Thời lượng mỗi buổi (phút)"
          required
          className="col-span-1"
        >
          <input
            id="confirmation-duration"
            type="number"
            min={1}
            required
            value={model.duration}
            onChange={(event) => model.setDuration(event.target.value)}
            className={widgetFieldClass}
          />
        </WidgetField>
        <WidgetField
          id="confirmation-sessions"
          label="Tổng số buổi học"
          required
          className="col-span-1"
        >
          <input
            id="confirmation-sessions"
            type="number"
            min={1}
            max={100}
            required
            value={model.sessions}
            onChange={(event) => model.setSessions(event.target.value)}
            className={widgetFieldClass}
          />
        </WidgetField>
        <WidgetField
          id="confirmation-schedule"
          label="Lịch học dự kiến"
          className="col-span-1 sm:col-span-2 lg:col-span-3"
        >
          <input
            id="confirmation-schedule"
            value={model.schedule}
            onChange={(event) => model.setSchedule(event.target.value)}
            placeholder="Ví dụ: Thứ 2, 4, 6 từ 19h00 đến 20h30"
            className={widgetFieldClass}
          />
        </WidgetField>
      </div>

      {/* Collapsible Technical UUID Section */}
      <Collapsible className="rounded-2xl border border-border/80 bg-muted/20 p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground">
            Mã gói giảng dạy (Offering UUID)
          </span>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="group inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
            >
              <ChevronDownIcon className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              <span>Xem UUID</span>
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2.5 border-t border-border/60 pt-2">
          <WidgetField
            id="confirmation-offering-id"
            label="Mã gói giảng dạy (Offering UUID)"
            required
          >
            <input
              id="confirmation-offering-id"
              disabled
              value={model.offeringId}
              onChange={(event) => model.setOfferingId(event.target.value)}
              placeholder="Mã UUID gói giảng dạy"
              className={`${widgetFieldClass} font-mono text-xs`}
            />
          </WidgetField>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Sau khi cập nhật, Gia sư và Học viên cần xác nhận lại.
        </p>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 w-full rounded-xl px-5 font-nunito text-xs font-extrabold shadow-xs transition-all active:scale-[0.98] sm:w-auto"
        >
          <CheckIcon className="size-4" aria-hidden="true" />
          <span>{busy ? "Đang cập nhật..." : "Cập nhật điều khoản lớp"}</span>
        </Button>
      </div>
    </form>
  );
}
