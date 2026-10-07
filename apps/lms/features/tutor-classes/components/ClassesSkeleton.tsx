import { pageClass, panelClass } from "@/components/lms-page-ui";

export function ClassesSkeleton({ detail = false }: { detail?: boolean }) {
  return <div role="status" aria-label="Đang tải lớp học" className={pageClass}>
    <span className="sr-only">Đang tải thông tin lớp học…</span>
    <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
      <div className="h-9 w-64 max-w-full rounded-2xl bg-muted" />
      <div className="h-5 w-96 max-w-full rounded-full bg-muted" />
      {detail ? <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]"><div className={`${panelClass} space-y-5`}>{Array.from({ length: 4 }, (_, index) => <div key={index} className="space-y-3"><div className="h-5 w-48 rounded-full bg-muted" /><div className="h-16 rounded-2xl bg-muted" /></div>)}</div><div className={`${panelClass} space-y-5`}>{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-12 rounded-2xl bg-muted" />)}</div></div>
        : <><div className={`${panelClass} space-y-4`}><div className="h-11 w-56 rounded-full bg-muted" /><div className="grid gap-3 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-11 rounded-2xl bg-muted" />)}</div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className={`${panelClass} space-y-4`}><div className="h-6 rounded-full bg-muted" /><div className="h-4 w-24 rounded-full bg-muted" /><div className="h-12 rounded-2xl bg-muted" /><div className="h-11 rounded-full bg-muted" /></div>)}</div></>}
    </div>
  </div>;
}
