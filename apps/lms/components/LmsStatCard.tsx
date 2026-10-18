import type { ReactNode } from "react";

const tones = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-warning",
  secondary: "bg-secondary/15 text-foreground",
};

export function LmsStatCard({ label, value, icon, tone = "primary" }: { label: string; value: string | number; icon: ReactNode; tone?: keyof typeof tones }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl [&>svg]:size-[18px] ${tones[tone]}`}>{icon}</span>
      <dl className="min-w-0"><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-foreground tabular-nums">{value}</dd></dl>
    </div>
  );
}
