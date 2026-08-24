import {
  CalendarCheck,
  CurrencyCircleDollar,
  HandCoins,
  HourglassMedium,
} from "@phosphor-icons/react";
import type { EarningsSummary } from "../types/earnings.types";
import { formatCurrency } from "../utils/earnings.utils";

export function EarningsSummaryCards({ summary }: { summary: EarningsSummary }) {
  const items = [
    {
      label: "Tổng thu nhập",
      value: formatCurrency(summary.total),
      helper: `${summary.sessionCount} buổi học hoàn thành`,
      icon: CurrencyCircleDollar,
      iconClass: "bg-[#280F91] text-white",
    },
    {
      label: "Đã quyết toán",
      value: formatCurrency(summary.settled),
      helper: "Đã chuyển vào số dư",
      icon: HandCoins,
      iconClass: "bg-[#447353] text-white",
    },
    {
      label: "Chờ quyết toán",
      value: formatCurrency(summary.pending),
      helper: "Gồm khoản đang kiểm tra",
      icon: HourglassMedium,
      iconClass: "bg-[#FFC500] text-[#0C0C0B]",
    },
    {
      label: "Buổi đã dạy",
      value: summary.sessionCount.toLocaleString("vi-VN"),
      helper: "Theo bộ lọc hiện tại",
      icon: CalendarCheck,
      iconClass: "bg-[#CFE1FA] text-[#280F91]",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tổng quan thu nhập">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.label}
            className="rounded-2xl border border-[#DCE8FB] bg-glass p-4 shadow-[0_8px_28px_rgba(40,15,145,0.06)] backdrop-blur-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-2 truncate font-nunito text-2xl font-extrabold text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
              </div>
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.iconClass}`}>
                <Icon size={21} weight="duotone" aria-hidden="true" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

