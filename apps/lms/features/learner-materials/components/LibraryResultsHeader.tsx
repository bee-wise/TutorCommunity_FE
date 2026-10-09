import { Button } from "@workspace/ui/components/ui/button";
import { libraryOutlineButton } from "./learner-materials-ui";

export function LibraryResultsHeader({ id, title, count, unit, onReset }: {
  id: string; title: string; count: number; unit: string; onReset?: () => void;
}) {
  return (
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
      <h2 id={id} className="font-nunito text-base font-extrabold text-foreground">{title}<span aria-live="polite" aria-atomic="true" className="ml-2 text-sm font-medium text-muted-foreground">{count} {unit} phù hợp</span></h2>
      {onReset && count > 0 && <Button type="button" variant="outline" className={libraryOutlineButton} onClick={onReset}>Đặt lại bộ lọc</Button>}
    </div>
  );
}
