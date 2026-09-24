export function ProfileRegistrationSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 px-4 pb-16 pt-28" aria-label="Đang tải hồ sơ">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-32 rounded-2xl bg-slate-200" />
        <div className="grid items-start gap-5 lg:grid-cols-[240px_1fr]">
          <div className="h-72 rounded-2xl bg-slate-200" />
          <div className="h-[620px] rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
