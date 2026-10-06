export function EarningsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải thu nhập"
      className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Đang tải thu nhập và thanh toán…</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        <div className="h-8 w-64 max-w-full rounded-2xl bg-muted" />
        <div className="h-4 w-96 max-w-full rounded-full bg-muted" />
        <div className="flex gap-3">
          <div className="h-11 w-40 rounded-full bg-muted" />
          <div className="h-11 w-32 rounded-full bg-muted" />
        </div>
        <div className="space-y-4 rounded-3xl border border-border p-5">
          <div className="h-11 w-64 max-w-full rounded-full bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-11 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex justify-between gap-5 p-5">
              <div className="h-12 w-48 rounded-2xl bg-muted" />
              <div className="h-12 w-32 rounded-2xl bg-muted" />
              <div className="hidden h-12 w-32 rounded-2xl bg-muted sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
