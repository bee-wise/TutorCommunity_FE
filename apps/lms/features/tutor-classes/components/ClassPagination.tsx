import { Button } from "@workspace/ui/components/ui/button";
import { classOutlineButton } from "./classes-ui";

export function ClassPagination({ page, pageCount, label, onPageChange }: {
  page: number;
  pageCount: number;
  label: string;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
      <Button type="button" variant="outline" className={classOutlineButton} disabled={!page} onClick={() => onPageChange(page - 1)}>Trước</Button>
      <span aria-live="polite" className="text-xs font-medium tabular-nums text-muted-foreground">Trang {page + 1} / {pageCount}</span>
      <Button type="button" variant="outline" className={classOutlineButton} disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}>Sau</Button>
    </nav>
  );
}
