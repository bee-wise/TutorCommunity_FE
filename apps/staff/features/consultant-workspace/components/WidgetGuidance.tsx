import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import type { WidgetTab } from "../hooks/useConsultantWidgetTools";

const guidance = {
  payment: {
    title: "Quy trình thanh toán lớp học",
    description: "Sau khi Gia sư và Học viên cùng duyệt điều khoản, hệ thống tạo lớp học và hiển thị yêu cầu thanh toán ngay trong phòng chat.",
    icon: CreditCardIcon,
    steps: [
      "Học viên lấy liên kết thanh toán và hoàn tất giao dịch qua PayOS.",
      "Trạng thái yêu cầu tự chuyển sang Đã thanh toán khi giao dịch thành công.",
    ],
  },
  sessions: {
    title: "Quy trình xếp lịch buổi học",
    description: "Khi lớp học đã được thanh toán và chuyển sang trạng thái ACTIVE, Gia sư xếp lịch chi tiết trên widget trong chat.",
    icon: CalendarDaysIcon,
    steps: [
      "Hệ thống kiểm tra trùng lịch của Gia sư và Học viên trước khi lưu.",
      "Các buổi học mới xuất hiện trên timeline của cả hai bên.",
    ],
  },
} as const;

export function WidgetGuidance({ tab }: { tab: Extract<WidgetTab, "payment" | "sessions"> }) {
  const item = guidance[tab];
  const Icon = item.icon;
  return (
    <section
      id={`consultant-widget-panel-${tab}`}
      role="tabpanel"
      aria-labelledby={`consultant-widget-tab-${tab}`}
      className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-nunito text-base font-extrabold leading-tight text-foreground sm:text-lg">
            {item.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
      <ol className="mt-4 space-y-2 border-t border-border pt-4">
        {item.steps.map((step, index) => (
          <li
            key={step}
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3 text-xs leading-relaxed text-foreground transition-colors hover:bg-muted/50 sm:text-sm"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black text-accent-foreground shadow-2xs font-nunito">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
