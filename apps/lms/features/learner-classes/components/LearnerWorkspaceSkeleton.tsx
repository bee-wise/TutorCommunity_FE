import { Skeleton } from "@workspace/ui/components/ui/skeleton";

export function LearnerWorkspaceSkeleton({ view }: { view: "classes" | "detail" | "sessions" | "report" }) {
  if (view === "classes") {
    return (
      <div role="status" aria-label="Đang tải danh sách lớp học" className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <span className="sr-only">Đang tải danh sách lớp học</span>
        <Skeleton className="h-9 w-32 rounded-xl motion-safe:animate-pulse" />
        <div className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-12 w-56 max-w-full rounded-full motion-safe:animate-pulse" />
            <Skeleton className="h-5 w-24 rounded-lg motion-safe:animate-pulse" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_repeat(3,minmax(140px,1fr))]">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-lg motion-safe:animate-pulse" />
                <Skeleton className="h-11 w-full rounded-2xl motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-3xl motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-label="Đang tải không gian học tập" className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <span className="sr-only">Đang tải dữ liệu học tập</span>
      <Skeleton className="h-9 w-56 rounded-xl motion-safe:animate-pulse" />
      {view === "report" && <Skeleton className="h-44 w-full rounded-3xl motion-safe:animate-pulse" />}
      <div className={view === "detail" || view === "sessions" ? "grid gap-4 xl:grid-cols-2" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
        {Array.from({ length: view === "detail" ? 2 : 3 }, (_, index) => <Skeleton key={index} className="h-56 rounded-3xl motion-safe:animate-pulse" />)}
      </div>
    </div>
  );
}
