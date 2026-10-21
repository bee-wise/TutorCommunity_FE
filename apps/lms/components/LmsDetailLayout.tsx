import type { ReactNode } from "react";

interface LmsDetailLayoutProps {
  children: ReactNode;
  /** Secondary column; sticks beside the content on large screens and stacks below on small ones. */
  aside?: ReactNode;
}

export function LmsDetailLayout({ children, aside }: LmsDetailLayoutProps) {
  if (!aside) return <div className="space-y-5">{children}</div>;
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">{children}</div>
      <aside className="space-y-5 lg:sticky lg:top-6">{aside}</aside>
    </div>
  );
}
