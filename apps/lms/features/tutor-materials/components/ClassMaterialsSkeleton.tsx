export function ClassMaterialsSkeleton({
  workspace = false,
}: {
  workspace?: boolean;
}) {
  return (
    <div
      className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6"
      role="status"
      aria-label="Đang tải tài liệu"
    >
      <span className="sr-only">Đang tải tài liệu...</span>
      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="h-9 w-64 max-w-full rounded-full bg-border" />
        <div className="h-20 rounded-3xl border border-border bg-card shadow-soft" />
        <div
          className={`grid gap-6 ${workspace ? "lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]" : "md:grid-cols-2 xl:grid-cols-3"}`}
        >
          {Array.from({ length: workspace ? 2 : 6 }, (_, index) => (
            workspace ? <div key={index} className="h-80 rounded-3xl border border-border bg-card shadow-soft" /> :
            <div key={index} className="flex min-h-[280px] flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft">
              <div className="h-10 w-5/6 rounded-2xl bg-border" />
              <div className="flex justify-between gap-3"><div className="h-5 w-16 rounded-full bg-border" /><div className="h-6 w-24 rounded-full bg-border" /></div>
              <div className="h-4 w-28 rounded-full bg-border" />
              <div className="flex items-center gap-3"><div className="size-8 rounded-full bg-border" /><div className="h-5 w-32 max-w-full rounded-full bg-border" /></div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-3"><div className="h-5 rounded-xl bg-border" /><div className="h-5 rounded-xl bg-border" /></div>
              <div className="mt-auto h-11 rounded-full bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
