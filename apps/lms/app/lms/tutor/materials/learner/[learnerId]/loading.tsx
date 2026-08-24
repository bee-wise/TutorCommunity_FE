function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#DCE8FB]/70 ${className}`} />;
}

export default function LearnerMaterialsLoading() {
  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_350px]"><Skeleton className="h-[520px] w-full rounded-2xl" /><Skeleton className="h-[480px] w-full rounded-2xl" /></div>
      </div>
    </div>
  );
}
