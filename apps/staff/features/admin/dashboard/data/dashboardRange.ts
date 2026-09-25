export type DashboardRangePreset = "today" | "7d" | "30d" | "custom";

export interface DashboardRange {
  from: Date;
  to: Date;
  label: string;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return formatDateInput(date) === value ? date : null;
}

export function resolveDashboardRange(
  preset: DashboardRangePreset,
  referenceDate: Date,
  customFrom: string,
  customTo: string,
): DashboardRange | null {
  const today = startOfDay(referenceDate);
  if (preset === "custom") {
    const from = parseDateInput(customFrom);
    const to = parseDateInput(customTo);
    if (!from || !to || from > to || to > today) return null;
    return { from, to: to.getTime() === today.getTime() ? referenceDate : endOfDay(to), label: `${customFrom} → ${customTo}` };
  }

  const days = preset === "today" ? 1 : preset === "7d" ? 7 : 30;
  const from = new Date(today);
  from.setDate(from.getDate() - days + 1);
  const label =
    preset === "today"
      ? "Hôm nay"
      : preset === "7d"
        ? "7 ngày qua"
        : "30 ngày qua";
  return { from, to: referenceDate, label };
}

export function previousDashboardRange(range: DashboardRange): DashboardRange {
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  const days = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
  const previousTo = new Date(from);
  previousTo.setDate(previousTo.getDate() - 1);
  previousTo.setHours(range.to.getHours(), range.to.getMinutes(), range.to.getSeconds(), range.to.getMilliseconds());
  const previousFrom = new Date(previousTo);
  previousFrom.setDate(previousFrom.getDate() - days + 1);
  previousFrom.setHours(0, 0, 0, 0);
  return { from: previousFrom, to: previousTo, label: "Kỳ trước" };
}
