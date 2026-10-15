import { Button } from "@workspace/ui/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Pagination, PaginationContent, PaginationItem } from "@workspace/ui/components/ui/pagination";

export function ClassPagination({ page, pageCount, label, onPageChange }: {
  page: number;
  pageCount: number;
  label: string;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  const start = Math.max(0, Math.min(page - 2, pageCount - 5));
  const visiblePages = Array.from({ length: Math.min(pageCount, 5) }, (_, index) => start + index);
  return (
    <Pagination aria-label={label} className="justify-center sm:justify-end">
      <PaginationContent className="flex-wrap gap-1.5">
        <PaginationItem><Button type="button" variant="outline" size="icon" aria-label="Trang trước" className="size-10 rounded-xl transition-all active:scale-95" disabled={!page} onClick={() => onPageChange(page - 1)}><ChevronLeftIcon className="size-4" /></Button></PaginationItem>
        {start > 0 && <PaginationItem><Button type="button" variant="ghost" aria-label="Trang 1" className="size-10 rounded-xl transition-all active:scale-95" onClick={() => onPageChange(0)}>1</Button></PaginationItem>}
        {start > 1 && <PaginationItem><span aria-hidden="true" className="grid size-10 place-items-center text-muted-foreground">…</span></PaginationItem>}
        {visiblePages.map((item) => <PaginationItem key={item}><Button type="button" variant={item === page ? "default" : "ghost"} aria-label={`Trang ${item + 1}`} aria-current={item === page ? "page" : undefined} className="size-10 rounded-xl font-bold tabular-nums transition-all active:scale-95" onClick={() => onPageChange(item)}>{item + 1}</Button></PaginationItem>)}
        {start + visiblePages.length < pageCount - 1 && <PaginationItem><span aria-hidden="true" className="grid size-10 place-items-center text-muted-foreground">…</span></PaginationItem>}
        {start + visiblePages.length < pageCount && <PaginationItem><Button type="button" variant="ghost" aria-label={`Trang ${pageCount}`} className="size-10 rounded-xl transition-all active:scale-95" onClick={() => onPageChange(pageCount - 1)}>{pageCount}</Button></PaginationItem>}
        <PaginationItem><Button type="button" variant="outline" size="icon" aria-label="Trang sau" className="size-10 rounded-xl transition-all active:scale-95" disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}><ChevronRightIcon className="size-4" /></Button></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
