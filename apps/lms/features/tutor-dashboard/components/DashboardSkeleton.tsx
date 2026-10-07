export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Đang tải tổng quan gia sư">
      <span className="sr-only">Đang tải tổng quan gia sư...</span>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="h-60 rounded-3xl border border-border bg-card shadow-soft md:rounded-[32px]" />
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-20 rounded-2xl bg-border" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(290px,1fr)]">
          <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="h-8 w-48 rounded-full bg-border" />
            {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-3xl bg-border" />)}
          </div>
          <div className="space-y-6">
            <div className="h-72 rounded-3xl border border-border bg-card shadow-soft" />
            <div className="h-72 rounded-3xl border border-border bg-card shadow-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
