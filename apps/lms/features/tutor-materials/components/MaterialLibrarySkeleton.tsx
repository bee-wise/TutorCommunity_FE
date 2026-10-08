import { libraryPage, libraryPanel } from "./material-library-ui";

export function MaterialLibrarySkeleton() {
  return (
    <div className={libraryPage} role="status" aria-label="Đang tải danh sách lớp tài liệu">
      <span className="sr-only">Đang tải danh sách lớp tài liệu...</span>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="space-y-2"><div className="h-8 w-64 max-w-full rounded-xl bg-muted" /><div className="h-5 w-96 max-w-full rounded-lg bg-muted" /></div>
        <div className={`${libraryPanel} space-y-5`}>
          <div className="h-12 w-64 max-w-full rounded-full bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div className="h-16 rounded-2xl bg-muted md:col-span-2 xl:col-span-1" /><div className="h-16 rounded-2xl bg-muted" /><div className="h-16 rounded-2xl bg-muted" />
          </div>
        </div>
        <div className="h-6 w-40 rounded-lg bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="flex min-h-[280px] flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft"><div className="h-10 rounded-xl bg-muted" /><div className="flex justify-between gap-3"><div className="h-5 w-16 rounded-full bg-muted" /><div className="h-5 w-24 rounded-full bg-muted" /></div><div className="h-4 w-28 rounded-lg bg-muted" /><div className="h-9 rounded-xl bg-muted" /><div className="h-6 rounded-lg bg-muted" /><div className="mt-auto h-11 rounded-full bg-muted" /></div>)}
        </div>
      </div>
    </div>
  );
}
