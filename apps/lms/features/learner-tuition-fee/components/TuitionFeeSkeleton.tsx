function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export function TuitionFeeSkeleton() {
  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1300px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-3"><Skeleton className="h-9 w-72 max-w-full" /><Skeleton className="h-4 w-[520px] max-w-full" /></div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <div className="rounded-2xl border border-border bg-white p-4"><Skeleton className="h-7 w-52" /><div className="mt-5 space-y-3">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-28 w-full" />)}</div></div>
      </div>
    </div>
  );
}
