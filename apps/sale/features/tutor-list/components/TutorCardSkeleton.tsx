// Skeleton loader — matches TutorCard layout exactly
export function TutorCardSkeleton() {
  return (
    <div
      className="relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-[#dce3f0] bg-white p-5 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex flex-col flex-1 gap-4">
        {/* Avatar + Name row */}
        <div className="mb-1 flex items-center justify-between">
          <div className="h-6 w-28 rounded-full bg-muted" />
          <div className="h-9 w-9 rounded-full bg-muted" />
        </div>
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-2xl bg-muted shrink-0 sm:h-24 sm:w-24" />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <div className="h-3.5 w-3/4 bg-muted rounded-full" />
            <div className="h-3 w-1/2 bg-muted/70 rounded-full" />
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full bg-muted rounded-full" />
          <div className="h-3 w-4/5 bg-muted/70 rounded-full" />
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2.5 rounded-xl bg-muted/30 p-3">
          <div className="h-3 w-20 bg-muted rounded-full" />
          <div className="h-3 w-4/5 bg-muted/70 rounded-full" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-5 w-16 bg-muted rounded-md" />
          <div className="h-5 w-14 bg-muted/70 rounded-md" />
          <div className="h-5 w-18 bg-muted/60 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 bg-muted rounded-full" />
          <div className="h-4 w-32 bg-muted/80 rounded-full" />
        </div>
        <div className="h-8 w-20 bg-muted rounded-full" />
      </div>
    </div>
  );
}
