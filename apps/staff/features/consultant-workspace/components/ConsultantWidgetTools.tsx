"use client";

import type { KeyboardEvent } from "react";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ChatTeachingOffering } from "@workspace/core/services/chat-rooms.service";
import { useConsultantWidgetTools, type WidgetTab } from "../hooks/useConsultantWidgetTools";
import { ConfirmationWidgetPanel } from "./ConfirmationWidgetPanel";
import { TrialWidgetForm } from "./TrialWidgetForm";
import { WidgetGuidance } from "./WidgetGuidance";

const tabs = [
  { value: "trial", label: "Học thử", icon: AcademicCapIcon },
  { value: "confirmation", label: "Xác nhận lớp", icon: DocumentTextIcon },
  { value: "payment", label: "Thanh toán", icon: CreditCardIcon },
  { value: "sessions", label: "Xếp lịch", icon: CalendarDaysIcon },
] as const;

export function ConsultantWidgetTools({
  roomId,
  teachingOfferings,
  onSent,
  calendarPortalContainer,
  initialTab,
  initialConfirmationId,
}: {
  roomId: string;
  teachingOfferings: ChatTeachingOffering[];
  onSent: () => void;
  calendarPortalContainer?: HTMLElement | null;
  initialTab?: WidgetTab;
  initialConfirmationId?: string;
}) {
  const model = useConsultantWidgetTools(
    roomId,
    teachingOfferings,
    onSent,
    initialTab,
    initialConfirmationId,
  );

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: WidgetTab) {
    const index = tabs.findIndex((item) => item.value === current);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextTab = tabs[next].value;
    model.chooseTab(nextTab);
    document.getElementById(`consultant-widget-tab-${nextTab}`)?.focus();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-border bg-muted/40 p-1.5" role="tablist" aria-label="Loại widget hỗ trợ">
        {tabs.map(({ value, label, icon: Icon }) => {
          const active = model.tab === value;
          return (
            <Button
              key={value}
              id={`consultant-widget-tab-${value}`}
              type="button"
              variant={active ? "default" : "ghost"}
              role="tab"
              aria-label={label}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(event) => handleTabKeyDown(event, value)}
              onClick={() => model.chooseTab(value)}
              className={`h-9 min-w-0 gap-1 rounded-xl px-1 text-[11px] font-bold transition-all active:scale-[0.98] sm:gap-1.5 sm:px-3 sm:text-xs ${
                active ? "shadow-xs font-bold" : "text-muted-foreground hover:bg-card hover:text-foreground font-semibold"
              }`}
            >
              <Icon className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
              <span className="truncate sm:hidden">{value === "confirmation" ? "Xác nhận" : label}</span>
              <span className="hidden truncate sm:inline">{label}</span>
            </Button>
          );
        })}
      </div>

      {model.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/10 p-3 text-xs sm:text-sm font-medium text-destructive shadow-2xs"
        >
          <ExclamationCircleIcon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
          <span>{model.error}</span>
        </div>
      )}
      {model.success && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs"
        >
          <CheckCircleIcon className="mt-0.5 size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{model.success}</span>
        </div>
      )}

      {model.tab === "trial" && (
        <TrialWidgetForm
          model={model.trial}
          busy={model.busy}
          calendarPortalContainer={calendarPortalContainer}
        />
      )}
      {model.tab === "confirmation" && (
        <ConfirmationWidgetPanel
          model={model.confirmation}
          busy={model.busy}
          calendarPortalContainer={calendarPortalContainer}
        />
      )}
      {(model.tab === "payment" || model.tab === "sessions") && (
        <WidgetGuidance tab={model.tab} />
      )}
    </div>
  );
}
