import { pageClass, panelClass } from "./lms-page-ui";

export function LmsPageSkeleton({ profile = false }: { profile?: boolean }) {
  return (
    <div role="status" aria-label="Đang tải nội dung" className={pageClass}>
      <span className="sr-only">Đang tải nội dung…</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        <div className="h-9 w-64 max-w-full rounded-2xl bg-muted" />
        <div className="h-4 w-96 max-w-full rounded-full bg-muted" />
        <div className={profile ? "grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]" : "space-y-5"}>
          <div className={`${panelClass} space-y-4`}><div className={`${profile ? "size-20 rounded-full" : "h-11 w-full rounded-2xl"} bg-muted`} /><div className="h-5 w-40 rounded-full bg-muted" /><div className="h-5 w-56 max-w-full rounded-full bg-muted" /></div>
          <div className={`${panelClass} space-y-6`}>{Array.from({ length: profile ? 5 : 6 }, (_, index) => <div key={index} className="flex justify-between gap-4"><div className="h-12 w-64 max-w-full rounded-2xl bg-muted" /><div className="h-11 w-28 rounded-full bg-muted" /></div>)}</div>
        </div>
      </div>
    </div>
  );
}
