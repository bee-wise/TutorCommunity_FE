import { CheckCircle, Clock, MagnifyingGlass } from "@phosphor-icons/react";
import type { SettlementStatus } from "../types/earnings.types";

const STATUS_CONFIG = {
  settled: {
    label: "Đã quyết toán",
    icon: CheckCircle,
    className: "bg-[#447353]/10 text-[#447353] border-[#447353]/20",
  },
  pending: {
    label: "Chờ quyết toán",
    icon: Clock,
    className: "bg-[#FFC500]/15 text-[#905B0F] border-[#FFC500]/35",
  },
  reviewing: {
    label: "Đang kiểm tra",
    icon: MagnifyingGlass,
    className: "bg-[#280F91]/8 text-[#280F91] border-[#280F91]/15",
  },
} as const;

export function EarningsStatusBadge({ status }: { status: SettlementStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      <Icon size={14} weight="bold" aria-hidden="true" />
      {config.label}
    </span>
  );
}

