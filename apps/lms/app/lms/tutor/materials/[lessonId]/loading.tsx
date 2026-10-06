function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-lg bg-[#e8ebf0] motion-safe:animate-pulse ${className}`} />;
}

export default function LessonDetailLoading() {
  return (
    <div className="min-h-full bg-background" aria-busy="true" aria-label="Đang tải chi tiết buổi học">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Skeleton className="h-5 w-48" />
        <div className="mt-6 space-y-3 border-b border-border pb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-5 w-[520px] max-w-full" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(270px,340px)_minmax(0,1fr)] lg:gap-6">
          <div className="space-y-5">
            <div className="space-y-5 rounded-xl border border-border bg-card p-6">
              <Skeleton className="h-6 w-44" />
              {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-9 w-full" />)}
            </div>
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-3 h-5 w-[440px] max-w-full" />
            <Skeleton className="mt-8 h-[320px] w-full sm:h-[400px]" />
            <div className="mt-6 flex justify-end"><Skeleton className="h-11 w-48" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
