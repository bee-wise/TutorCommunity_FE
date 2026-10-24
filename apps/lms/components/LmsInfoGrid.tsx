import type { ElementType, ReactNode } from "react";

export interface LmsInfoItem {
  icon: ElementType;
  label: string;
  value: ReactNode;
}

/** A few key facts of one record as quiet tiles: icon, small label, one strong value. Pick facts the reader acts on. */
export function LmsInfoGrid({ title, titleId, items }: { title: string; titleId: string; items: LmsInfoItem[] }) {
  return (
    <section aria-labelledby={titleId} className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <h2 id={titleId} className="font-lms text-lg font-extrabold">{title}</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-w-0 items-center gap-3.5 rounded-2xl bg-muted p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-soft">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-base font-extrabold leading-snug [overflow-wrap:anywhere]">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
