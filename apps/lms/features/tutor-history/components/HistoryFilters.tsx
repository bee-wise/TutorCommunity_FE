import { LmsSelect } from "@/components/LmsSelect";
import { inputClass, panelClass } from "@/components/lms-page-ui";
import { HISTORY_STATUS_LABELS, type HistoryFilters as Filters } from "../types/history.types";

const OPTIONS = [{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(HISTORY_STATUS_LABELS).map(([value, label]) => ({ value, label }))];

export function HistoryFilters({ filters, onChange }: { filters: Filters; onChange: (patch: Partial<Filters>) => void }) {
  const invalidRange = !!(filters.from && filters.to && filters.from > filters.to);
  return (
    <section aria-label="Bộ lọc lịch sử kết nối" className={`${panelClass} space-y-4`}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px]">
        <label className="grid gap-2 md:col-span-2 xl:col-span-1"><span className="text-sm font-bold">Tìm học viên / mã kết nối</span><input type="search" className={inputClass} value={filters.search} onChange={(event) => onChange({ search: event.target.value })} placeholder="Tên học viên hoặc mã kết nối…" /></label>
        <div className="grid gap-2"><label htmlFor="history-status" className="text-sm font-bold">Trạng thái</label><LmsSelect id="history-status" value={filters.status} options={OPTIONS} onValueChange={(value) => {
          if (value === "all" || value === "waiting" || value === "active" || value === "converted" || value === "cancelled" || value === "timeout" || value === "closed" || value === "unknown") onChange({ status: value });
        }} /></div>
        <div className="grid gap-2"><label htmlFor="history-sort" className="text-sm font-bold">Sắp xếp</label><LmsSelect id="history-sort" value={filters.sort} options={[{ value: "newest", label: "Mới nhất" }, { value: "oldest", label: "Cũ nhất" }]} onValueChange={(value) => { if (value === "newest" || value === "oldest") onChange({ sort: value }); }} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
        <label className="grid gap-2"><span className="text-sm font-bold">Kết nối từ ngày</span><input type="date" className={inputClass} value={filters.from} onChange={(event) => onChange({ from: event.target.value })} aria-invalid={invalidRange} aria-describedby={invalidRange ? "history-date-error" : undefined} /></label>
        <label className="grid gap-2"><span className="text-sm font-bold">Đến ngày</span><input type="date" className={inputClass} value={filters.to} onChange={(event) => onChange({ to: event.target.value })} aria-invalid={invalidRange} aria-describedby={invalidRange ? "history-date-error" : undefined} /></label>
      </div>
      {invalidRange && <p id="history-date-error" role="alert" className="text-sm text-destructive">Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.</p>}
    </section>
  );
}
