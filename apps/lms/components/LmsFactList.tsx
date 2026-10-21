import type { ElementType, ReactNode } from "react";

export interface LmsFact {
  icon: ElementType;
  label: string;
  value: ReactNode;
}

/** Label/value facts about one record. Each fact is shown once on the screen. */
export function LmsFactList({ facts }: { facts: LmsFact[] }) {
  return (
    <dl className="grid gap-x-6 sm:grid-cols-2">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Icon className="size-[18px]" aria-hidden="true" /></span>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-sm font-bold [overflow-wrap:anywhere]">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
