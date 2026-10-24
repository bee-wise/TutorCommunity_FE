import { classPage, classPanel, classToolbar } from "./classes-ui";
import { ClassFiltersSkeleton } from "./ClassFiltersSkeleton";

const block = "rounded-xl bg-muted";
const hero = "h-52 rounded-[var(--radius-panel)] bg-muted sm:h-56";

function SessionCardsSkeleton() {
  return <>{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-36 rounded-3xl border border-border bg-muted sm:h-32" />)}</>;
}

/** Session list placeholder for use inside a loaded page; the page wrapper and hero already exist around it. */
export function ClassSessionListSkeleton() {
  return <div role="status" aria-label="Đang tải danh sách buổi học" className="space-y-4 motion-safe:animate-pulse">
    <span className="sr-only">Đang tải danh sách buổi học…</span>
    <div aria-hidden="true" className="space-y-4"><SessionCardsSkeleton /></div>
  </div>;
}

/** Mirrors the real screens: hero + info/links (overview), hero + filters + cards (sessions), title + toolbar + roster (members). */
export function ClassWorkspaceSkeleton({ screen = "overview" }: { screen?: "overview" | "sessions" | "members" }) {
  return <div role="status" aria-label="Đang tải không gian lớp" className={classPage}>
    <span className="sr-only">Đang tải thông tin lớp…</span>
    <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
      {screen === "members" ? <>
        <div className={`h-7 w-40 ${block}`} />
        <div className={`${classToolbar} flex items-center justify-between gap-3 p-4 sm:p-5`}><div className="h-11 w-64 max-w-full rounded-2xl bg-muted" /><div className="h-11 w-full max-w-sm rounded-full bg-muted" /></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-64 rounded-3xl border border-border bg-muted" />)}</div>
      </> : screen === "sessions" ? <>
        <div className={hero} />
        <ClassFiltersSkeleton />
        <div className="space-y-4"><SessionCardsSkeleton /></div>
      </> : <>
        <div className={hero} />
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className={`${classPanel} space-y-4 sm:p-6`}>
            <div className={`h-6 w-32 ${block}`} />
            <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[72px] rounded-2xl bg-muted" />)}</div>
          </div>
          <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className={`h-6 w-28 ${block}`} />
            {Array.from({ length: 4 }, (_, index) => <div key={index} className={`h-12 ${block}`} />)}
          </div>
        </div>
      </>}
    </div>
  </div>;
}
