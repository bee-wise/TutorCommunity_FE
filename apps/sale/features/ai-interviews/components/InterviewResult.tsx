import type { ReactNode } from "react";
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { interviewPanelClass } from "./InterviewUi";

export function InterviewResult({ title, message, tone = "waiting", children }: {
  title: string; message: string; tone?: "success" | "waiting" | "warning"; children?: ReactNode;
}) {
  const Icon = tone === "success" ? CheckCircleIcon : tone === "warning" ? ExclamationCircleIcon : ClockIcon;
  return <section className={`${interviewPanelClass} overflow-hidden`}>
    <div className={`flex items-center gap-3 border-b border-border px-5 py-4 sm:px-8 ${tone === "success" ? "bg-secondary/5" : "bg-muted/40"}`}>
      <Icon aria-hidden="true" className={`size-6 ${tone === "success" ? "text-secondary" : "text-primary"}`} />
      <span className="text-sm font-semibold">{tone === "success" ? "Đã được phê duyệt" : tone === "warning" ? "Cần bạn kiểm tra" : "Trạng thái phỏng vấn"}</span>
    </div>
    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <h2 className="font-nunito text-2xl font-extrabold leading-snug sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{message}</p>
      {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
    </div>
  </section>;
}
