import { AcademicCapIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";
import type { ConsultantWidgetModel } from "../hooks/useConsultantWidgetTools";
import { TeachingModeToggle, WidgetField, widgetFieldClass } from "./WidgetFormParts";

interface TrialWidgetFormProps {
  model: ConsultantWidgetModel["trial"];
  busy: boolean;
  calendarPortalContainer?: HTMLElement | null;
}

export function TrialWidgetForm({ model, busy, calendarPortalContainer }: TrialWidgetFormProps) {
  const datePickerClass = "[&>button]:min-h-10 [&>button]:rounded-xl [&>button]:bg-card";

  return (
    <form
      id="consultant-widget-panel-trial"
      role="tabpanel"
      aria-labelledby="consultant-widget-tab-trial"
      onSubmit={(event) => void model.createTrial(event)}
      className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <AcademicCapIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-nunito text-base font-extrabold leading-tight text-foreground">
            Đề xuất buổi học thử
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Hoàn tất thông tin để gửi lịch học vào phòng chat.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-4">
        <WidgetField id="trial-subject" label="Môn học" required>
          <input
            id="trial-subject"
            required
            value={model.subject}
            onChange={(event) => model.setSubject(event.target.value)}
            placeholder="Ví dụ: Toán lớp 10, IELTS Speaking"
            className={widgetFieldClass}
          />
        </WidgetField>

        <TeachingModeToggle
          label="Hình thức giảng dạy"
          value={model.teachingMode}
          onChange={model.setTeachingMode}
        />

        <fieldset className="min-w-0 rounded-2xl border border-primary/10 bg-primary/[0.035] p-3 sm:col-span-2 sm:p-3.5">
          <legend className="px-1 font-nunito text-xs font-extrabold text-primary">Thời gian học</legend>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <WidgetField id="trial-start" label="Bắt đầu" required>
              <DateTimePicker
                id="trial-start"
                value={model.startAt}
                onChange={model.setStartAt}
                minDate={new Date()}
                placeholder="Chọn ngày và giờ bắt đầu"
                side="right"
                align="center"
                portalContainer={calendarPortalContainer}
                className={datePickerClass}
              />
            </WidgetField>
            <WidgetField id="trial-end" label="Kết thúc" required>
              <DateTimePicker
                id="trial-end"
                value={model.endAt}
                onChange={model.setEndAt}
                minDate={model.startAt ? new Date(new Date(model.startAt).getTime() + 60_000) : new Date()}
                placeholder="Chọn ngày và giờ kết thúc"
                side="left"
                align="center"
                portalContainer={calendarPortalContainer}
                className={datePickerClass}
              />
            </WidgetField>
          </div>
        </fieldset>

        <WidgetField
          id="trial-location"
          label={model.teachingMode === "ONLINE" ? "Liên kết phòng học" : "Địa điểm học"}
          required
        >
          <input
            id="trial-location"
            required
            value={model.location}
            onChange={(event) => model.setLocation(event.target.value)}
            placeholder={model.teachingMode === "ONLINE" ? "Zoom, Google Meet hoặc mã phòng" : "Địa chỉ buổi học"}
            className={widgetFieldClass}
          />
        </WidgetField>

        <WidgetField id="trial-note" label="Ghi chú (tùy chọn)">
          <input
            id="trial-note"
            value={model.note}
            onChange={(event) => model.setNote(event.target.value)}
            placeholder="Nội dung cần chuẩn bị"
            className={widgetFieldClass}
          />
        </WidgetField>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDaysIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
          Lịch học sẽ xuất hiện trong phòng chat.
        </p>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 w-full rounded-xl px-5 font-nunito text-xs font-extrabold transition-all active:scale-[0.98] sm:w-auto"
        >
          {busy ? "Đang gửi đề xuất..." : "Gửi đề xuất học thử"}
        </Button>
      </div>
    </form>
  );
}
