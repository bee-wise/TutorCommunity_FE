"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialDay } from "../data/dashboard.mock";
import { formatMoney } from "./DashboardMetricCard";

type SeriesKey = "gmv" | "grossRevenue" | "profit";
interface ChartPoint { label: string; gmv: number; grossRevenue: number; profit: number }

const seriesOptions: { key: SeriesKey; label: string; color: string }[] = [
  { key: "gmv", label: "GMV", color: "var(--primary)" },
  { key: "grossRevenue", label: "Doanh thu gross", color: "var(--secondary)" },
  { key: "profit", label: "Lợi nhuận ước tính", color: "var(--warning)" },
];

function dateLabel(value: string, showYear: boolean): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}${showYear ? `/${year.slice(-2)}` : ""}`;
}

function chartPoints(days: FinancialDay[], to: Date): ChartPoint[] {
  if (days.length === 1) {
    const day = days[0];
    const bucketCount = Math.min(8, Math.max(1, to.getHours() + 1));
    const weights = Array.from({ length: bucketCount }, (_, index) => 1 + Math.sin((index / bucketCount) * Math.PI));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let used = { gmv: 0, grossRevenue: 0, profit: 0 };
    return weights.map((weight, index) => {
      const last = index === weights.length - 1;
      const point = {
        label: `${bucketCount === 1 ? to.getHours() : Math.round((to.getHours() * index) / (bucketCount - 1))}h`,
        gmv: last ? day.gmv - used.gmv : Math.round((day.gmv * weight) / totalWeight),
        grossRevenue: last ? day.grossRevenue - used.grossRevenue : Math.round((day.grossRevenue * weight) / totalWeight),
        profit: last ? day.profit - used.profit : Math.round((day.profit * weight) / totalWeight),
      };
      used = { gmv: used.gmv + point.gmv, grossRevenue: used.grossRevenue + point.grossRevenue, profit: used.profit + point.profit };
      return point;
    });
  }
  const groupSize = Math.max(1, Math.ceil(days.length / 20));
  const showYear = days[0]?.date.slice(0, 4) !== days[days.length - 1]?.date.slice(0, 4);
  const points: ChartPoint[] = [];
  for (let index = 0; index < days.length; index += groupSize) {
    const group = days.slice(index, index + groupSize);
    const first = dateLabel(group[0].date, showYear);
    const last = dateLabel(group[group.length - 1].date, showYear);
    points.push({
      label: group.length === 1 ? first : `${first}–${last}`,
      gmv: group.reduce((sum, day) => sum + day.gmv, 0),
      grossRevenue: group.reduce((sum, day) => sum + day.grossRevenue, 0),
      profit: group.reduce((sum, day) => sum + day.profit, 0),
    });
  }
  return points;
}

export function FinancialTrendChart({ days, to }: { days: FinancialDay[]; to: Date }) {
  const [selected, setSelected] = useState<SeriesKey>("gmv");
  const option = seriesOptions.find((item) => item.key === selected) ?? seriesOptions[0];
  const points = useMemo(() => chartPoints(days, to), [days, to]);

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">Diễn biến theo thời gian</h3>
          <p className="mt-1 text-xs text-muted-foreground">Dữ liệu tài chính mô phỏng · chọn chỉ số để xem cùng thang đo</p>
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Chỉ số biểu đồ tài chính">
          {seriesOptions.map((item) => (
            <button key={item.key} type="button" onClick={() => setSelected(item.key)} aria-pressed={selected === item.key} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected === item.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 h-60 min-w-0" role="img" aria-label={`Biểu đồ ${option.label} theo thời gian`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={80}>
          <AreaChart data={points} margin={{ top: 6, right: 10, bottom: 0, left: 0 }} accessibilityLayer>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={(value: number) => formatMoney(value, true).replace(" ₫", "")} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as ChartPoint;
              return <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"><p className="font-semibold">{point.label}</p><p className="mt-1 tabular-nums">{formatMoney(point[selected])}</p></div>;
            }} />
            <Area type="monotone" dataKey={selected} stroke={option.color} fill={option.color} fillOpacity={0.12} strokeWidth={2.5} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
