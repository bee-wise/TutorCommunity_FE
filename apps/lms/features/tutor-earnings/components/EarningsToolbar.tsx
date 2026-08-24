import {
  CalendarBlank,
  DownloadSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { EarningsPeriod } from "../types/earnings.types";
import type { SettlementFilter } from "../hooks/useEarnings";

const PERIODS: { value: EarningsPeriod; label: string }[] = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

interface EarningsToolbarProps {
  period: EarningsPeriod;
  referenceDate: string;
  status: SettlementFilter;
  search: string;
  exportDisabled: boolean;
  onPeriodChange: (period: EarningsPeriod) => void;
  onReferenceDateChange: (date: string) => void;
  onStatusChange: (status: SettlementFilter) => void;
  onSearchChange: (search: string) => void;
  onExport: () => void;
}

export function EarningsToolbar(props: EarningsToolbarProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc thu nhập">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-muted/70 p-1 xl:w-auto">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => props.onPeriodChange(item.value)}
              className={`min-w-16 flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors active:scale-[0.98] xl:flex-none ${
                props.period === item.value
                  ? "bg-white text-[#280F91] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_180px_170px_auto] xl:flex-1">
          <label className="relative block">
            <span className="sr-only">Tìm buổi học</span>
            <MagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
              aria-hidden="true"
            />
            <input
              value={props.search}
              onChange={(event) => props.onSearchChange(event.target.value)}
              placeholder="Tìm mã buổi, học viên, lớp..."
              className="h-10 w-full rounded-xl border border-input bg-white pl-10 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-[#280F91]/25"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Ngày tham chiếu</span>
            <CalendarBlank
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={17}
              aria-hidden="true"
            />
            <input
              type="date"
              value={props.referenceDate}
              onChange={(event) => props.onReferenceDateChange(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-white pl-9 pr-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#280F91]/25"
            />
          </label>

          <label>
            <span className="sr-only">Trạng thái quyết toán</span>
            <select
              value={props.status}
              onChange={(event) => props.onStatusChange(event.target.value as SettlementFilter)}
              className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#280F91]/25"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="settled">Đã quyết toán</option>
              <option value="pending">Chờ quyết toán</option>
              <option value="reviewing">Đang kiểm tra</option>
            </select>
          </label>

          <button
            type="button"
            disabled={props.exportDisabled}
            onClick={props.onExport}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white transition-colors hover:bg-[#280F91]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            Xuất Excel
          </button>
        </div>
      </div>
    </section>
  );
}

