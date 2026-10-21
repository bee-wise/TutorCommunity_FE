import type { ReactNode } from "react";

interface LmsClassHeaderProps {
  field?: string;
  subject: string;
  name?: string;
  level?: string;
  /** Status badge, class kind, teaching mode. */
  badges: ReactNode;
  /** One primary action plus quiet secondary ones. */
  actions?: ReactNode;
  /** Short status notice, e.g. a finished class. */
  notice?: ReactNode;
}

/** Header of a class's own pages (overview, sessions, members) for both roles. */
export function LmsClassHeader({ field, subject, name, level, badges, actions, notice }: LmsClassHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          {field && <p className="text-sm font-bold text-muted-foreground">{field}</p>}
          <h1 className="font-lms text-2xl font-extrabold leading-[1.15] text-primary [overflow-wrap:anywhere] sm:text-3xl">{subject}</h1>
          {(name || level) && (
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {level && <span className="rounded-lg bg-muted px-2 py-1 text-xs font-bold text-primary">{level}</span>}
              {name && <span className="[overflow-wrap:anywhere]">{name}</span>}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1">{badges}</div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {notice}
    </header>
  );
}
