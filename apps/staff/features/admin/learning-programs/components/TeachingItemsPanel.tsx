"use client";

import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { LearningCatalogItem } from "../schemas/learning-program.schema";
import type { useLearningProgramsAdmin } from "../hooks/useLearningProgramsAdmin";

export function TeachingItemsPanel({ state, onEdit, onDeactivate, onActivate }: {
  state: ReturnType<typeof useLearningProgramsAdmin>;
  onEdit: (item: LearningCatalogItem | null) => void;
  onDeactivate: (item: LearningCatalogItem) => void;
  onActivate: (item: LearningCatalogItem) => void;
}) {
  const items = state.teachingItems.data ?? [];
  return <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-xl font-bold text-foreground">Danh mục nội dung dạy</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Tạo nội dung trước, sau đó liên kết vào các phiên bản chương trình bằng tổ hợp.</p></div>
      <Button type="button" onClick={() => onEdit(null)}><Plus className="size-4" /> Tạo nội dung dạy</Button>
    </div>
    {state.teachingItems.isPending ? <div className="mt-5 h-36 animate-pulse rounded-xl bg-muted" /> : state.teachingItems.isError ? <div className="mt-5 rounded-xl bg-destructive/5 p-5 text-sm text-destructive">Không tải được danh mục nội dung dạy. <button type="button" className="underline" onClick={() => void state.teachingItems.refetch()}>Thử lại</button></div> : items.length ? (
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <div key={item.id} className="flex min-w-0 flex-col rounded-2xl border border-border p-4">
          <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-primary/5 px-2 py-1 text-xs font-bold text-primary">{item.code || "—"}</span><span className={`text-[11px] font-semibold ${item.status?.toUpperCase() === "ACTIVE" ? "text-emerald-700" : "text-muted-foreground"}`}>{item.status || "Chưa rõ"}</span></div>
          <h3 className="mt-3 flex-1 text-base font-bold text-foreground">{item.name || "Chưa đặt tên"}</h3>
          <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item)}><PencilSimple className="size-4" /> Sửa</Button>
            {item.status?.toUpperCase() === "ACTIVE" ? <Button type="button" variant="ghost" size="sm" onClick={() => onDeactivate(item)}><Trash className="size-4" /> Ngừng hoạt động</Button> : <Button type="button" variant="ghost" size="sm" onClick={() => onActivate(item)}>Kích hoạt</Button>}
          </div>
        </div>)}
      </div>
    ) : <p className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Chưa có nội dung dạy. Tạo môn hoặc chứng chỉ đầu tiên.</p>}
  </section>;
}
