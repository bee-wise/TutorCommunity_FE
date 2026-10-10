import { classPage, classPanel, classToolbar } from "./classes-ui";
import { ClassFiltersSkeleton } from "./ClassFiltersSkeleton";

export function ClassWorkspaceSkeleton({ screen = "overview" }: { screen?: "overview" | "sessions" | "members" }) {
  return <div role="status" aria-label="Đang tải không gian lớp" className={classPage}>
    <span className="sr-only">Đang tải thông tin lớp…</span>
    <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 w-72 max-w-full rounded-xl bg-muted" />
      {screen === "members" ? <><div className={`${classToolbar} space-y-1`}><div className="h-4 w-24 rounded-md bg-muted" /><div className="h-11 max-w-xl rounded-2xl bg-muted" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className={`${classPanel} space-y-4`}><div className="h-10 rounded-xl bg-muted" /><div className="h-4 w-28 rounded-lg bg-muted" /></div>)}</div></>
        : screen === "sessions" ? <div className="space-y-4"><ClassFiltersSkeleton /><div className="h-4 w-40 rounded-md bg-muted" />{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-40 rounded-2xl border border-border bg-muted" />)}</div>
          : <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><div className="space-y-5"><div className={`${classPanel} h-60`} /><div className={`${classPanel} h-60`} /></div><div className={`${classPanel} space-y-5`}><div className="h-6 w-40 rounded-xl bg-muted" />{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-12 rounded-xl bg-muted" />)}</div></div>}
    </div>
  </div>;
}
