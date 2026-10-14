import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@workspace/ui/components/ui/pagination";

export function ClassListPager({ page, hasNext, label, onPageChange }: {
  page: number;
  hasNext: boolean;
  label: string;
  onPageChange: (page: number) => void;
}) {
  if (page === 1 && !hasNext) return null;
  return <Pagination aria-label={label} className="justify-center sm:justify-end">
    <PaginationContent className="gap-2">
      <PaginationItem><Button type="button" variant="outline" size="icon" aria-label="Trang trước" className="size-10 rounded-xl transition-all active:scale-95" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeftIcon className="size-4" /></Button></PaginationItem>
      <PaginationItem><span aria-current="page" className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold tabular-nums text-primary-foreground">{page}</span></PaginationItem>
      <PaginationItem><Button type="button" variant="outline" size="icon" aria-label="Trang sau" className="size-10 rounded-xl transition-all active:scale-95" disabled={!hasNext} onClick={() => onPageChange(page + 1)}><ChevronRightIcon className="size-4" /></Button></PaginationItem>
    </PaginationContent>
  </Pagination>;
}
