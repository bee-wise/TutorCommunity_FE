function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export function LearnerMaterialsSkeleton() {
  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Skeleton className="h-5 w-36" />
        <div className="rounded-2xl border border-border bg-white p-5">
          <Skeleton className="h-7 w-64 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="overflow-hidden rounded-2xl border border-border bg-white p-4">
          <Skeleton className="h-6 w-48" />
          <div className="mt-5 space-y-3">
            {[0, 1, 2].map((item) => <Skeleton key={item} className="h-28 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
