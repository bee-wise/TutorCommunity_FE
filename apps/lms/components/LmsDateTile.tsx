const TIME_ZONE = "Asia/Ho_Chi_Minh";

export type LmsDateTileTone = "accent" | "primary" | "secondary" | "muted";

const HEADER: Record<LmsDateTileTone, string> = {
  accent: "bg-accent text-accent-foreground",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  muted: "bg-muted text-muted-foreground",
};

/** Calendar-style tile: coloured weekday band, big day number and month (Vietnam time). */
export function LmsDateTile({ value, tone = "accent" }: { value: string; tone?: LmsDateTileTone }) {
  const date = new Date(value);
  const valid = !Number.isNaN(date.getTime());
  const parts = valid ? new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, weekday: "short", day: "2-digit", month: "numeric" }).formatToParts(date) : [];
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return (
    <div className="flex w-[4.5rem] shrink-0 flex-col items-center self-start overflow-hidden rounded-2xl border border-border bg-card text-center shadow-xs" aria-hidden="true">
      <span className={`w-full py-1 text-[11px] font-extrabold uppercase ${HEADER[tone]}`}>{valid ? pick("weekday") : "—"}</span>
      <span className="font-lms text-3xl font-black leading-[1.15] tabular-nums text-foreground">{valid ? pick("day") : "--"}</span>
      <span className="pb-1.5 text-[11px] font-bold text-muted-foreground">{valid ? `Tháng ${pick("month")}` : ""}</span>
    </div>
  );
}
