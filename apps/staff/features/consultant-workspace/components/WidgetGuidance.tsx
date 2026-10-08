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
      className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-nunito text-lg font-extrabold leading-[1.2] text-foreground">
        {item.title}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <ol className="mt-5 space-y-3 border-t border-border pt-5">
        {item.steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-accent-foreground">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
