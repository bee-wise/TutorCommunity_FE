"use client";

import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useTutorOverview } from "../hooks/useTutorOverview";
import { DashboardLink } from "./DashboardLink";

export function DashboardReadiness() {
  const { readiness } = useTutorOverview();
  const data = readiness.data;
  if (readiness.isPending || readiness.isError || !data) return null;

  const steps = [
    { label: "Hồ sơ đã công khai", done: data.isPublic },
    { label: "Đã chọn khung giờ dạy", done: data.availabilityTimeCompleted },
    { label: "Đã cập nhật tài khoản ngân hàng", done: data.bankInformationCompleted },
  ];
  const doneCount = steps.filter((step) => step.done).length;
  if (data.isReady && doneCount === steps.length) return null;

  return (
    <section className="space-y-3" aria-labelledby="dashboard-readiness">
      <div className="flex items-center justify-between gap-2">
        <h2 id="dashboard-readiness" className="font-lms text-sm font-extrabold leading-[1.3] text-foreground">Hoàn thiện hồ sơ</h2>
        <span className="rounded-lg bg-accent/20 px-2 py-1 text-[11px] font-bold tabular-nums text-warning">{doneCount}/{steps.length}</span>
      </div>
      <div role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={steps.length} aria-label="Tiến độ hoàn thiện hồ sơ" className="h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2 text-sm">
            {step.done
              ? <CheckCircleIcon className="size-5 shrink-0 text-secondary" aria-hidden="true" />
              : <ExclamationCircleIcon className="size-5 shrink-0 text-warning" aria-hidden="true" />}
            <span className={step.done ? "text-muted-foreground" : "font-semibold text-foreground"}>{step.label}</span>
          </li>
        ))}
      </ul>
      <DashboardLink href="/lms/tutor/profile" variant="outline" className="w-full">Cập nhật hồ sơ</DashboardLink>
    </section>
  );
}
