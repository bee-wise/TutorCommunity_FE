import { libraryPage, libraryPanel } from "./learner-materials-ui";

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-xl bg-muted motion-safe:animate-pulse ${className}`} />;
}

export function LearnerMaterialsSkeleton({ view = "classes" }: { view?: "classes" | "sessions" | "materials" }) {
  return (
    <div className={libraryPage} role="status" aria-label="Đang tải kho tài liệu">
      <div aria-hidden="true" className="space-y-6">
        <div className="space-y-3">{view !== "classes" && <Skeleton className="h-11 w-44 rounded-full" />}<Skeleton className="h-8 w-72 max-w-full" /><Skeleton className="h-4 w-[440px] max-w-full" /></div>
        {view !== "classes" && <div className={libraryPanel}><Skeleton className="h-9 w-full" /></div>}
        <div className={`${libraryPanel} space-y-5`}>
          {view === "classes" && <Skeleton className="h-12 w-72 max-w-full rounded-full" />}
          <div className={`grid gap-4 md:grid-cols-2 ${view === "classes" ? "xl:grid-cols-[minmax(0,1fr)_170px_190px_190px]" : "xl:grid-cols-[minmax(0,1fr)_220px_220px]"}`}>
            {Array.from({ length: view === "classes" ? 4 : 3 }, (_, index) => <div key={index} className={`space-y-2 ${view !== "classes" && index === 0 ? "md:col-span-2 xl:col-span-1" : ""}`}><Skeleton className="h-4 w-24" /><Skeleton className="h-11 w-full rounded-2xl" /></div>)}
          </div>
        </div>
        <Skeleton className="h-6 w-56" />
        <div className={view === "materials" ? "space-y-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {Array.from({ length: view === "materials" ? 3 : 6 }, (_, index) => <div key={index} className={`${libraryPanel} space-y-4 ${view === "materials" ? "min-h-40" : "min-h-[300px]"}`}><Skeleton className="h-6 w-full" /><Skeleton className="h-5 w-32" /><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-11 w-full rounded-xl" /></div>)}
        </div>
      </div>
    </div>
  );
}
