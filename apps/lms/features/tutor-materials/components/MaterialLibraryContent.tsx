import { Button } from "@workspace/ui/components/ui/button";
import type { ClassKind } from "../types/class-materials.types";
import type { MaterialLibraryCard, MaterialLibraryFilters } from "../types/material-library.types";
import { MaterialClassCard } from "./MaterialClassCard";
import { MaterialLibraryFilters as LibraryFilters } from "./MaterialLibraryFilters";
import { libraryOutlineButton, libraryPage, libraryPanel } from "./material-library-ui";

interface MaterialLibraryContentProps {
  cards: readonly MaterialLibraryCard[];
  filters: MaterialLibraryFilters;
  counts: Readonly<Record<ClassKind, number>>;
  storageError: string | null;
  onFiltersChange: (patch: Partial<MaterialLibraryFilters>) => void;
  onResetFilters: () => void;
}

export function MaterialLibraryContent({ cards, filters, counts, storageError, onFiltersChange, onResetFilters }: MaterialLibraryContentProps) {
  const filtered = Boolean(filters.search || filters.status !== "all" || filters.sort !== "newest");
  return (
    <div className={libraryPage}>
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl">Quản lý tài liệu</h1>
          <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-muted-foreground">Dữ liệu lớp minh họa</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">Một không gian tài liệu chung cho mỗi lớp 1:1 hoặc lớp nhóm.</p>
      </header>
      {storageError && <p role="alert" className="rounded-2xl border border-destructive/30 bg-card px-4 py-3 text-sm leading-relaxed text-destructive">{storageError}</p>}
      <LibraryFilters filters={filters} counts={counts} onChange={onFiltersChange} />
      <section aria-labelledby="material-library-results" className="space-y-4">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <h2 id="material-library-results" className="font-nunito text-base font-extrabold text-foreground">
            Danh sách lớp<span aria-live="polite" aria-atomic="true" className="ml-2 text-sm font-medium text-muted-foreground">{cards.length} lớp phù hợp</span>
          </h2>
          {filtered && cards.length > 0 && <Button type="button" variant="outline" className={libraryOutlineButton} onClick={onResetFilters}>Đặt lại bộ lọc</Button>}
        </div>
        {cards.length > 0 ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <MaterialClassCard key={card.classInfo.id} {...card} />)}</div> : (
          <div className={`${libraryPanel} space-y-3 py-10 text-center`}>
            <h3 className="font-nunito text-lg font-extrabold text-primary">Không tìm thấy lớp học</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">Thử đổi tab, từ khóa hoặc trạng thái lớp.</p>
            <Button type="button" variant="outline" className={libraryOutlineButton} onClick={onResetFilters}>Đặt lại bộ lọc</Button>
          </div>
        )}
      </section>
    </div>
  );
}
