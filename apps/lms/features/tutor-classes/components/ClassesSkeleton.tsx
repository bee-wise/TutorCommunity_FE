import { classPage, classPanel } from "./classes-ui";

export function ClassesSkeleton({ detail = false }: { detail?: boolean }) {
  return (
    <div role="status" aria-label="Đang tải lớp học" className={classPage}>
      <span className="sr-only">Đang tải thông tin lớp học…</span>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        {detail && <div className="h-11 w-40 rounded-xl bg-muted" />}
        <div className="space-y-2"><div className="h-8 w-64 max-w-full rounded-xl bg-muted" /><div className="h-5 w-96 max-w-full rounded-lg bg-muted" /></div>
        {detail ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
            <div className={`${classPanel} space-y-5`}>
              <div className="h-6 w-48 rounded-lg bg-muted" />
              <div className="h-11 rounded-xl bg-muted" />
              <div className="grid grid-cols-2 gap-3"><div className="h-11 rounded-xl bg-muted" /><div className="h-11 rounded-xl bg-muted" /></div>
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="space-y-3 rounded-2xl border border-border p-4"><div className="h-4 w-48 max-w-full rounded-lg bg-muted" /><div className="h-6 rounded-lg bg-muted" /><div className="ml-auto h-11 w-32 rounded-xl bg-muted" /></div>)}
            </div>
            <div className={`${classPanel} space-y-4`}><div className="h-6 w-40 rounded-lg bg-muted" />{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-20 rounded-2xl bg-muted" />)}</div>
          </div>
        ) : (
          <>
            <div className={`${classPanel} space-y-5`}><div className="h-12 w-56 max-w-full rounded-2xl bg-muted" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px]"><div className="h-16 rounded-xl bg-muted md:col-span-2 xl:col-span-1" /><div className="h-16 rounded-xl bg-muted" /><div className="h-16 rounded-xl bg-muted" /></div></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => <div key={index} className={`${classPanel} space-y-4`}><div className="h-5 w-24 rounded-full bg-muted" /><div className="h-12 rounded-xl bg-muted" /><div className="h-16 rounded-2xl bg-muted" /><div className="h-4 w-32 rounded-lg bg-muted" /><div className="h-11 rounded-xl bg-muted" /></div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
