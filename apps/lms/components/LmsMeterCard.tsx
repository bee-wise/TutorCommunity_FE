import { cn } from "@workspace/core/helpers/utils";

interface LmsMeterCardProps {
  label: string;
  value: number;
  max: number;
  /** One line explaining the figure, e.g. "Còn 3 chỗ trống". */
  caption: string;
  tone?: "primary" | "secondary";
}

export function LmsMeterCard({ label, value, max, caption, tone = "primary" }: LmsMeterCardProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div>
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-extrabold tabular-nums">{value} / {max}</p>
      </div>
      <div className="mt-4 space-y-1.5">
        <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)} className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500", tone === "primary" ? "bg-primary" : "bg-secondary")} style={{ width: `${percent}%` }} />
        </div>
        <p className="text-[11px] font-semibold text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}
