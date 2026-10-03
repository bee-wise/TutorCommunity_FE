"use client";

import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { useLearningProgramsAdmin } from "../hooks/useLearningProgramsAdmin";
import type { LearningCatalogItem } from "../schemas/learning-program.schema";

export function ProgramTypesPanel({ state, onEdit, onDeactivate, onActivate }: {
  state: ReturnType<typeof useLearningProgramsAdmin>;
  onEdit: (item: LearningCatalogItem | null) => void;
  onDeactivate: (item: LearningCatalogItem) => void;
  onActivate: (item: LearningCatalogItem) => void;
}) {
  const items = state.programTypes.data ?? [];

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Loại chương trình</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Tạo nhóm chương trình trước khi cấu hình chương trình học. Chỉ loại đang hoạt động mới xuất hiện trong form tạo chương trình.
          </p>
        </div>
        <Button type="button" onClick={() => onEdit(null)}>
          <Plus className="size-4" /> Tạo loại chương trình
        </Button>
      </div>

      {state.programTypes.isPending ? (
        <div className="mt-5 h-36 animate-pulse rounded-xl bg-muted" />
      ) : state.programTypes.isError ? (
        <div className="mt-5 rounded-xl bg-destructive/5 p-5 text-sm text-destructive">
          Không tải được loại chương trình. <button type="button" className="underline" onClick={() => void state.programTypes.refetch()}>Thử lại</button>
        </div>
      ) : items.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const active = item.status?.toUpperCase() === "ACTIVE";
            return (
              <div key={item.id} className="flex min-w-0 flex-col rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="max-w-full break-all rounded-lg bg-primary/5 px-2 py-1 text-xs font-bold text-primary">{item.code || "—"}</span>
                  <span className={`shrink-0 text-[11px] font-semibold ${active ? "text-emerald-700" : "text-muted-foreground"}`}>
                    {active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </div>
                <h3 className="mt-3 flex-1 text-base font-bold text-foreground">{item.name || "Chưa đặt tên"}</h3>
                <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item)}>
                    <PencilSimple className="size-4" /> Sửa
                  </Button>
                  {active ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => onDeactivate(item)}>
                      <Trash className="size-4" /> Ngừng hoạt động
                    </Button>
                  ) : (
                    <Button type="button" variant="ghost" size="sm" onClick={() => onActivate(item)}>
                      Kích hoạt
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Chưa có loại chương trình. Tạo các loại Việt Nam, Ngoại ngữ và Chương trình quốc tế / du học để dùng trong chương trình học.
        </p>
      )}
    </section>
  );
}
