import { classFiltersGrid, classSessionFiltersGrid, classToolbar } from "./classes-ui";

export function ClassFiltersSkeleton({ withKinds = false }: { withKinds?: boolean }) {
  return (
    <div className={`${classToolbar} ${withKinds ? classFiltersGrid : classSessionFiltersGrid}`}>
      {withKinds && (
        <div className="col-span-2 flex gap-1 md:col-span-3 xl:col-span-1">
          <div className="h-11 w-24 rounded-full bg-muted" />
          <div className="h-11 w-28 rounded-full bg-muted" />
        </div>
      )}
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={`grid min-w-0 gap-1 ${index === 0 ? `col-span-2 ${withKinds ? "md:col-span-1" : "lg:col-span-1"}` : ""}`}>
          <div className="h-4 w-24 max-w-full rounded-md bg-muted" />
          <div className="h-11 rounded-2xl bg-muted" />
        </div>
      ))}
    </div>
  );
}
