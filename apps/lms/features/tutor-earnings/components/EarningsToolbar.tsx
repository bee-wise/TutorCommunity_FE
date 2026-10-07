import type { EarningsPeriod, SettlementFilter } from "../types/earnings.types";
import { EarningsSelect } from "./EarningsSelect";
import { inputClass, outlineActionClass, panelClass, primaryActionClass } from "./earnings-ui";

const PERIODS: { value: EarningsPeriod; label: string }[] = [
  { value: "day", label: "Ngày" }, { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" }, { value: "year", label: "Năm" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" }, { value: "settled", label: "Đã quyết toán" },
  { value: "pending", label: "Chờ quyết toán" }, { value: "reviewing", label: "Đang kiểm tra" },
];

interface EarningsToolbarProps {
  period: EarningsPeriod;
  referenceDate: string;
  status: SettlementFilter;
  search: string;
  onPeriodChange: (period: EarningsPeriod) => void;
  onReferenceDateChange: (date: string) => void;
  onStatusChange: (status: SettlementFilter) => void;
  onSearchChange: (search: string) => void;
}

export function EarningsToolbar(props: EarningsToolbarProps) {
  return (
    <section className={`${panelClass} space-y-4 p-4 sm:p-5`} aria-label="Bộ lọc thu nhập">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Khoảng thời gian" className="flex gap-2">
          {PERIODS.map((item) => (
            <button key={item.value} type="button" aria-pressed={props.period === item.value} onClick={() => props.onPeriodChange(item.value)} className={`${props.period === item.value ? primaryActionClass : outlineActionClass} min-w-14 flex-1 sm:flex-none`}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Giờ Việt Nam · Tuần bắt đầu từ thứ Hai</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_200px_220px]">
        <label className="grid gap-2 md:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold text-muted-foreground">Tìm buổi học</span>
          <input type="search" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Mã buổi, học viên, lớp hoặc môn học…" className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-bold text-muted-foreground">Mốc thời gian</span>
          <input type="date" value={props.referenceDate} onChange={(event) => props.onReferenceDateChange(event.target.value)} aria-invalid={!props.referenceDate} aria-describedby={!props.referenceDate ? "earnings-date-error" : undefined} className={inputClass} />
          {!props.referenceDate && <span id="earnings-date-error" className="text-xs text-destructive">Chọn mốc thời gian để xem thu nhập.</span>}
        </label>
        <div className="grid content-start gap-2">
          <label htmlFor="earnings-status" className="text-xs font-bold text-muted-foreground">Trạng thái quyết toán</label>
          <EarningsSelect id="earnings-status" value={props.status} options={STATUS_OPTIONS} onValueChange={(value) => {
            if (value === "all" || value === "settled" || value === "pending" || value === "reviewing") props.onStatusChange(value);
          }} />
        </div>
      </div>
    </section>
  );
}
