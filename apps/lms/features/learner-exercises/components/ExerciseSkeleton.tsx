function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export function ExerciseSkeleton() {
  return <div className="min-h-full bg-[#F8FAFC]"><div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="space-y-3"><Skeleton className="h-9 w-64 max-w-full" /><Skeleton className="h-4 w-[520px] max-w-full" /></div><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]"><Skeleton className="h-[460px] w-full" /><Skeleton className="h-72 w-full" /></div></div></div>;
}
