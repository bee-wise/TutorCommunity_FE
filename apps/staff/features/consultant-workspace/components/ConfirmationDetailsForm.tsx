import { CheckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ConsultantWidgetModel } from "../hooks/useConsultantWidgetTools";
import { TeachingModeToggle, WidgetField, widgetFieldClass } from "./WidgetFormParts";

export function ConfirmationDetailsForm({
  model,
  busy,
}: {
  model: ConsultantWidgetModel["confirmation"];
  busy: boolean;
}) {
  const selected = model.selected;
  if (!selected) return null;

  return (
    <form
      onSubmit={(event) => void model.updateConfirmation(event)}
      className="space-y-2 rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-4 lg:p-5"
    >
      <div className="flex items-center gap-2.5 border-b border-border pb-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <DocumentTextIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-nunito text-base font-extrabold leading-[1.2] text-foreground">
            Chi tiết điều khoản lớp học
          </h3>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {selected.subjectName || selected.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-3">
        <WidgetField id="confirmation-subject-id" label="Mã môn học (Subject UUID)" required className="col-span-2 sm:col-span-1">
          <input
            id="confirmation-subject-id"
            required
            value={model.subjectId}
            onChange={(event) => model.setSubjectId(event.target.value)}
            placeholder="Mã UUID môn học"
            className={`${widgetFieldClass} font-mono text-xs`}
          />
        </WidgetField>
        <WidgetField id="confirmation-offering-id" label="Mã gói giảng dạy (Offering UUID)" required className="col-span-2 sm:col-span-1">
          <input
            id="confirmation-offering-id"
            required
            value={model.offeringId}
            onChange={(event) => model.setOfferingId(event.target.value)}
            placeholder="Mã UUID gói giảng dạy"
            className={`${widgetFieldClass} font-mono text-xs`}
          />
        </WidgetField>

        <TeachingModeToggle
          label="Hình thức lớp học"
          value={model.classMode}
          onChange={model.setClassMode}
          className="col-span-2 sm:col-span-1"
        />
        <WidgetField id="confirmation-duration" label="Thời lượng mỗi buổi (phút)" required>
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
        <WidgetField id="confirmation-sessions" label="Tổng số buổi học" required>
          <input
            id="confirmation-sessions"
            type="number"
            min={1}
            required
            value={model.sessions}
            onChange={(event) => model.setSessions(event.target.value)}
            className={widgetFieldClass}
          />
        </WidgetField>
        <WidgetField id="confirmation-schedule" label="Lịch học dự kiến" className="col-span-2 sm:col-span-1">
          <input
            id="confirmation-schedule"
            value={model.schedule}
            onChange={(event) => model.setSchedule(event.target.value)}
            placeholder="Ví dụ: Thứ 2, 4, 6 từ 19h đến 20h30"
            className={widgetFieldClass}
          />
        </WidgetField>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
        <details className="text-[11px] text-muted-foreground sm:hidden">
          <summary className="w-fit cursor-pointer rounded-lg border border-border bg-background px-2 py-1 font-semibold transition-all active:scale-95">Cách tính học phí</summary>
          <p className="mt-1 leading-relaxed">Học phí được tính theo gói giảng dạy. Sau khi cập nhật, Gia sư và Học viên cần xác nhận lại.</p>
        </details>
        <p className="hidden max-w-md text-xs leading-relaxed text-muted-foreground sm:block">
          Học phí được tính theo gói giảng dạy. Sau khi cập nhật, Gia sư và Học viên cần xác nhận lại.
        </p>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 w-full rounded-full px-4 font-nunito text-xs font-extrabold transition-all active:scale-[0.98] sm:w-auto"
        >
          <CheckIcon className="size-4" aria-hidden="true" />
          {busy ? "Đang cập nhật..." : "Cập nhật điều khoản lớp"}
        </Button>
      </div>
    </form>
  );
}
