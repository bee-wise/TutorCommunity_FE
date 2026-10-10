import { classPage, classPanel } from "./classes-ui";
import { ClassFiltersSkeleton } from "./ClassFiltersSkeleton";

export function ClassesSkeleton() {
  return (
    <div role="status" aria-label="Đang tải lớp học" className={classPage}>
      <span className="sr-only">Đang tải thông tin lớp học…</span>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="h-8 w-64 max-w-full rounded-xl bg-muted" />
        <ClassFiltersSkeleton withKinds />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className={`${classPanel} space-y-4`}><div className="h-5 w-24 rounded-full bg-muted" /><div className="h-12 rounded-xl bg-muted" /><div className="h-16 rounded-2xl bg-muted" /><div className="h-4 w-32 rounded-lg bg-muted" /><div className="h-11 rounded-xl bg-muted" /></div>)}
        </div>
      </div>
    </div>
  );
}
