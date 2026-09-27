import type { ReactNode } from "react";

const integerFormatter = new Intl.NumberFormat("vi-VN");
const compactFormatter = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined
    ? "—"
    : integerFormatter.format(Math.round(value));
}

export function formatMoney(
  value: number | null | undefined,
  compact = false,
): string {
  if (value === null || value === undefined) return "—";
  return `${compact ? compactFormatter.format(value) : integerFormatter.format(Math.round(value))} ₫`;
}

export function formatPercent(value: number | null | undefined): string {
  return value === null || value === undefined
    ? "—"
    : `${value.toFixed(1).replace(".", ",")}%`;
}

export function formatDuration(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const seconds = Math.max(0, Math.round(value));
  return seconds < 60
    ? `${seconds} giây`
    : `${Math.floor(seconds / 60)}p ${String(seconds % 60).padStart(2, "0")}s`;
}

export interface MetricTrend {
  current: number;
  previous: number;
  favorable: "up" | "down";
}

export function MetricTrendLabel({ trend, prominent = false }: { trend: MetricTrend; prominent?: boolean }) {
  if (trend.previous === 0) return null;
  const change =
    ((trend.current - trend.previous) / Math.abs(trend.previous)) * 100;
  const neutral = Math.abs(change) < 0.05;
  const positive = trend.favorable === "up" ? change > 0 : change < 0;
  const color = prominent
    ? neutral ? "bg-muted text-muted-foreground" : positive ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"
    : neutral ? "text-muted-foreground" : positive ? "text-secondary" : "text-destructive";
  return (
    <span
      className={`text-xs font-bold ${prominent ? "rounded-full px-2 py-1" : ""} ${color}`}
    >
      {neutral ? "" : change > 0 ? "+" : ""}
      {formatPercent(neutral ? 0 : change)} so với kỳ trước
    </span>
  );
}

export function DashboardMetricCard({
  label,
  value,
  detail,
  mock = false,
  derived = false,
  tone = "plain",
  trend,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  mock?: boolean;
  derived?: boolean;
  tone?: "plain" | "primary" | "accent";
  trend?: MetricTrend;
  icon?: ReactNode;
}) {
  const color =
    tone === "primary"
      ? "border-primary bg-primary text-primary-foreground"
      : tone === "accent"
        ? "border-accent bg-accent text-accent-foreground"
        : "border-border bg-card text-foreground";
  const muted =
    tone === "primary"
      ? "text-primary-foreground/75"
      : tone === "accent"
        ? "text-accent-foreground/75"
        : "text-muted-foreground";

  return (
    <article className={`min-w-0 rounded-2xl border p-5 shadow-sm ${color}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${muted}`}>{label}</p>
        {icon && (
          <span
            aria-hidden="true"
            className={`shrink-0 ${tone === "plain" ? "text-primary" : ""}`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 break-words text-2xl font-bold tracking-tight tabular-nums @[42rem]/dashboard:text-3xl">
        {value}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-current/10 pt-3">
        {trend && <MetricTrendLabel trend={trend} prominent={tone !== "plain"} />}
        {detail && <span className={`text-xs ${muted}`}>{detail}</span>}
        {mock && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tone === "plain" ? "bg-accent/25 text-warning" : "bg-background/20"}`}
          >
            Mẫu
          </span>
        )}
        {derived && !mock && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-primary">
            Tính toán
          </span>
        )}
      </div>
    </article>
  );
}

export function DashboardSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      className="space-y-4"
      aria-labelledby={`dashboard-section-${number}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
        >
          {number}
        </span>
        <div className="min-w-0">
          <h2
            id={`dashboard-section-${number}`}
            className="text-xl font-bold text-foreground"
          >
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
