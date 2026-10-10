import { useState } from "react";
import { AcademicCapIcon, ArrowLeftIcon, ArrowPathIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import type { ConsultantWidgetModel } from "../hooks/useConsultantWidgetTools";
import { ConfirmationDetailsForm } from "./ConfirmationDetailsForm";
import { WidgetField, widgetFieldClass } from "./WidgetFormParts";

export function ConfirmationWidgetPanel({
  model,
  busy,
}: {
  model: ConsultantWidgetModel["confirmation"];
  busy: boolean;
}) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const completedTrials = model.trials.data?.filter(
    (item) =>
      item.status === "CONFIRMED" &&
      !!item.scheduledEndAt &&
      new Date(item.scheduledEndAt).getTime() <= model.trials.dataUpdatedAt,
  ) ?? [];
  const availableConfirmations = model.confirmations.data?.filter(
    (item) => !item.classId && item.status !== "CANCELLED",
  ) ?? [];
  const currentTrialIndex = Math.min(trialIndex, Math.max(0, completedTrials.length - 1));
  const selectedTrial = completedTrials[currentTrialIndex];

  return (
    <div
      id="consultant-widget-panel-confirmation"
      role="tabpanel"
      aria-labelledby="consultant-widget-tab-confirmation"
      className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)]"
    >
      <div className={`space-y-3 ${showDetails && model.selected ? "hidden md:block" : ""}`}>
        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft" aria-labelledby="completed-trials-heading">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <AcademicCapIcon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 id="completed-trials-heading" className="font-nunito text-sm font-extrabold text-foreground">Hoàn thành học thử</h3>
              <p className="text-[11px] text-muted-foreground">Tạo bản điều khoản lớp học.</p>
            </div>
          </div>
          {model.trials.isPending && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowPathIcon className="size-4 animate-spin text-primary" aria-hidden="true" />
              Đang kiểm tra buổi học thử...
            </p>
          )}
          {model.trials.error && (
            <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
              {getApiErrorMessage(model.trials.error)}
            </p>
          )}
          {!model.trials.isPending && !model.trials.error && !selectedTrial && (
            <p className="rounded-xl border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground">
              Chưa có buổi học thử sẵn sàng hoàn thành.
            </p>
          )}
          {selectedTrial && (
            <div className="space-y-2.5 rounded-2xl border border-border bg-background p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{selectedTrial.subject ?? "Buổi học thử"}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Kết thúc {new Date(selectedTrial.scheduledEndAt!).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </p>
                </div>
                {completedTrials.length > 1 && (
                  <span className="shrink-0 text-[11px] font-bold text-muted-foreground">
                    {currentTrialIndex + 1}/{completedTrials.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {completedTrials.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTrialIndex((index) => (index - 1 + completedTrials.length) % completedTrials.length)}
                    aria-label="Buổi học thử trước"
                    className="size-9 shrink-0 rounded-xl p-0 transition-all active:scale-95"
                  >
                    <ChevronLeftIcon className="size-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || selectedTrial.version == null}
                  onClick={() => {
                    if (selectedTrial.version != null) void model.completeTrial(selectedTrial.id, selectedTrial.version);
                  }}
                  className="h-9 min-w-0 flex-1 rounded-xl px-2 text-[11px] font-bold text-primary transition-all active:scale-[0.98]"
                >
                  <CheckIcon className="size-4" />
                  Hoàn thành
                </Button>
                {completedTrials.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTrialIndex((index) => (index + 1) % completedTrials.length)}
                    aria-label="Buổi học thử tiếp theo"
                    className="size-9 shrink-0 rounded-xl p-0 transition-all active:scale-95"
                  >
                    <ChevronRightIcon className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-2.5 rounded-3xl border border-border bg-card p-4 shadow-soft" aria-labelledby="choose-confirmation-heading">
          <h3 id="choose-confirmation-heading" className="font-nunito text-sm font-extrabold text-foreground">Chọn bản điều khoản</h3>
          <WidgetField id="confirmation-select" label="Bản điều khoản lớp học">
            <select
              id="confirmation-select"
              value={model.confirmationId}
              onChange={(event) => {
                model.chooseConfirmation(event.target.value);
                setShowDetails(Boolean(event.target.value));
              }}
              className={widgetFieldClass}
            >
              <option value="">Chọn bản điều khoản cần cập nhật</option>
              {availableConfirmations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subjectName || item.id.slice(0, 8)} · Phiên bản {item.version ?? 0} ({item.status ?? "DRAFT"})
                </option>
              ))}
            </select>
          </WidgetField>
          {model.selected && (
            <Button type="button" onClick={() => setShowDetails(true)} className="h-9 w-full rounded-xl text-xs font-bold transition-all active:scale-[0.98] md:hidden">
              Chỉnh điều khoản
            </Button>
          )}
          {model.confirmations.isPending && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowPathIcon className="size-4 animate-spin text-primary" aria-hidden="true" />
              Đang tải điều khoản...
            </p>
          )}
          {model.confirmations.error && (
            <p role="alert" className="flex items-start gap-1.5 text-xs text-destructive">
              <ExclamationCircleIcon className="size-4 shrink-0" aria-hidden="true" />
              {getApiErrorMessage(model.confirmations.error)}
            </p>
          )}
          {!model.confirmations.isPending && !model.confirmations.error && availableConfirmations.length === 0 && (
            <p className="text-xs text-muted-foreground">Chưa có bản điều khoản để cập nhật.</p>
          )}
        </section>
      </div>

      <div className={`min-w-0 ${showDetails && model.selected ? "" : "hidden md:block"}`}>
        {model.selected ? (
          <div>
            <Button type="button" variant="outline" onClick={() => setShowDetails(false)} className="mb-2 h-8 rounded-xl px-3 text-xs transition-all active:scale-95 md:hidden">
              <ArrowLeftIcon className="size-4" /> Chọn bản khác
            </Button>
            <ConfirmationDetailsForm model={model} busy={busy} />
          </div>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <DocumentTextIcon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="font-nunito text-sm font-extrabold text-foreground">Chi tiết điều khoản lớp học</h3>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Chọn bản điều khoản ở bên trái để chỉnh thời lượng, số buổi và lịch dự kiến.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
