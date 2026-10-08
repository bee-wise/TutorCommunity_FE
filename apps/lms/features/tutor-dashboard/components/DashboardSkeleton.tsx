export function DashboardSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Đang tải tổng quan gia sư">
      <span className="sr-only">Đang tải tổng quan gia sư...</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        <div className="space-y-2 py-1"><div className="h-8 w-64 max-w-full rounded-full bg-border" /><div className="h-5 w-80 max-w-full rounded-full bg-border" /></div>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
          <div className="space-y-5">
            <div className="h-72 rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="h-6 w-36 rounded-full bg-border" /><div className="mt-5 h-8 w-48 rounded-full bg-border" /><div className="mt-5 h-6 w-40 rounded-full bg-border" /><div className="mt-5 h-11 w-36 rounded-full bg-border" /></div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="h-7 w-48 rounded-full bg-border" /><div className="mt-5 h-11 rounded-full bg-border" />
              {[0, 1, 2, 3, 4].map((item) => <div key={item} className="mt-4 h-24 rounded-2xl bg-border" />)}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            <div className="space-y-5"><div className="h-56 rounded-3xl border border-border bg-card shadow-soft" /><div className="h-80 rounded-3xl border border-border bg-card shadow-soft" /></div>
            <div className="h-80 rounded-3xl border border-border bg-card shadow-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
