import type { ReactNode } from "react";

interface LmsPageHeaderProps {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export function LmsPageHeader({ title, eyebrow, actions }: LmsPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm font-semibold text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-1 font-lms text-2xl font-extrabold leading-[1.15] text-primary sm:text-3xl">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
