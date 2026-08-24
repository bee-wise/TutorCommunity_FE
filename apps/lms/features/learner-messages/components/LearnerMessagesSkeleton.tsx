function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export function LearnerMessagesSkeleton() {
  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden bg-[#F8FAFC] lg:p-4">
      <div className="mx-auto grid h-full max-w-[1400px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4 border-r border-border bg-white p-4 lg:rounded-2xl lg:border">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-20 w-full" />)}
        </div>
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white p-4 lg:block">
          <Skeleton className="h-12 w-full" />
          <div className="mt-8 space-y-5"><Skeleton className="h-16 w-[55%]" /><Skeleton className="ml-auto h-16 w-[45%]" /><Skeleton className="h-20 w-[60%]" /></div>
        </div>
      </div>
    </div>
  );
}
