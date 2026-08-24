function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export default function EarningsLoading() {
  return (
    <div className="min-h-full bg-[#F8FAFC]" aria-label="Đang tải dữ liệu thu nhập">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-52" />
          <SkeletonBlock className="h-9 w-72 max-w-full" />
          <SkeletonBlock className="h-4 w-[520px] max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-white p-5">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-4 h-8 w-36" />
              <SkeletonBlock className="mt-3 h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <SkeletonBlock className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <SkeletonBlock className="h-[520px] w-full rounded-2xl" />
          <SkeletonBlock className="h-[420px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
