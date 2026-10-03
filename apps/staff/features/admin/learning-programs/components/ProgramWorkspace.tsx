"use client";

import {
  CalendarDots,
  Copy,
  PencilSimple,
  Plus,
  RocketLaunch,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  contextTypeLabels,
  getProgramTypeLabel,
  type LearningCatalogItem,
} from "../schemas/learning-program.schema";
import type { useLearningProgramsAdmin } from "../hooks/useLearningProgramsAdmin";

type AdminState = ReturnType<typeof useLearningProgramsAdmin>;
type VersionEditor = {
  mode: "create" | "edit" | "clone";
  item: LearningCatalogItem | null;
};

function statusLabel(status: string | null | undefined) {
  const value = status?.toUpperCase();
  if (value === "DRAFT") return "Bản nháp";
  if (value === "ACTIVE") return "Đang áp dụng";
  if (value === "ARCHIVED") return "Đã lưu trữ";
  return status || "Chưa rõ trạng thái";
}

export function ProgramWorkspace({
  state,
  onVersionEditor,
  onContextEditor,
  onMappingEditor,
  onConfirm,
}: {
  state: AdminState;
  onVersionEditor: (editor: VersionEditor) => void;
  onContextEditor: (item: LearningCatalogItem | null) => void;
  onMappingEditor: (item: LearningCatalogItem | null) => void;
  onConfirm: (
    action:
      | "deleteVersion"
      | "publishVersion"
      | "deleteContext"
      | "deleteMapping",
    item: LearningCatalogItem,
  ) => void;
}) {
  const program = state.currentProgram;
  const version = state.currentVersion;
  const isDraft = version?.status?.toUpperCase() === "DRAFT";
  const contexts = state.contexts.data ?? [];
  const mappings = state.mappings.data ?? [];
  const teachingItems = state.teachingItems.data ?? [];
  const mappingsByContext = new Map<string, LearningCatalogItem[]>();
  for (const mapping of mappings) {
    const key = mapping.contextId ?? "";
    const group = mappingsByContext.get(key) ?? [];
    group.push(mapping);
    mappingsByContext.set(key, group);
  }
  const itemName = (id: string | null | undefined) =>
    teachingItems.find((item) => item.id === id)?.name ||
    teachingItems.find((item) => item.id === id)?.code ||
    "Nội dung dạy đã ngừng hoạt động";
  const contextName = (id: string | null | undefined) =>
    id
      ? contexts.find((item) => item.id === id)?.name ||
        contexts.find((item) => item.id === id)?.code ||
        "Ngữ cảnh không còn trong phiên bản"
      : "Không áp dụng cấp học";

  if (!program) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Tạo hoặc chọn một chương trình để bắt đầu cấu hình phiên bản.
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/15 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Cấu hình chương trình
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {program.name || program.code || "Chương trình chưa đặt tên"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {getProgramTypeLabel(program.type, state.programTypes.data)} ·{" "}
                {program.code || "Chưa có mã"}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onVersionEditor({ mode: "create", item: null })}
              className="rounded-xl"
              disabled={
                state.isSaving ||
                Boolean(
                  program.status && program.status.toUpperCase() !== "ACTIVE",
                )
              }
            >
              <Plus className="size-4" /> Tạo phiên bản nháp
            </Button>
          </div>
        </div>
        <div className="border-t border-border p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground">Các phiên bản</h3>
            <span className="text-xs text-muted-foreground">
              {state.versions.data?.length ?? 0} phiên bản
            </span>
          </div>
          {state.versions.isError ? (
            <div className="rounded-xl bg-destructive/5 p-4 text-sm text-destructive">
              Không tải được phiên bản.{" "}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => void state.versions.refetch()}
              >
                Thử lại
              </button>
            </div>
          ) : state.versions.isPending ? (
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          ) : state.versions.data?.length ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {state.versions.data.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => state.chooseVersion(item.id)}
                  className={`min-w-44 shrink-0 rounded-xl border px-4 py-3 text-left transition ${item.id === state.currentVersionId ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/40"}`}
                >
                  <span className="block truncate text-sm font-bold text-foreground">
                    {item.name || item.code || "Phiên bản"}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${item.status?.toUpperCase() === "ACTIVE" ? "font-semibold text-emerald-700" : "text-muted-foreground"}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              Chưa có phiên bản. Tạo bản nháp để thêm ngữ cảnh và tổ hợp.
            </p>
          )}
        </div>
      </section>

      {version ? (
        <>
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${isDraft ? "bg-amber-100 text-amber-800" : version.status?.toUpperCase() === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
                >
                  {statusLabel(version.status)}
                </span>
                <h3 className="mt-2 text-xl font-bold text-foreground">
                  {version.name || "Phiên bản chưa đặt tên"}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDots className="size-4" />{" "}
                  {version.effectiveFrom
                    ? `Hiệu lực từ ${new Date(version.effectiveFrom).toLocaleDateString("vi-VN")}`
                    : "Chưa đặt ngày hiệu lực"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isDraft ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onVersionEditor({ mode: "edit", item: version })
                      }
                    >
                      <PencilSimple className="size-4" /> Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onConfirm("deleteVersion", version)}
                    >
                      <Trash className="size-4" /> Xóa nháp
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onConfirm("publishVersion", version)}
                      disabled={
                        !mappings.length ||
                        state.mappings.isPending ||
                        state.mappings.isError
                      }
                    >
                      <RocketLaunch className="size-4" /> Xuất bản
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onVersionEditor({ mode: "clone", item: version })
                    }
                  >
                    <Copy className="size-4" /> Clone thành bản nháp
                  </Button>
                )}
              </div>
            </div>
            {!isDraft ? (
              <p className="mt-4 rounded-xl bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
                Phiên bản đã xuất bản hoặc lưu trữ chỉ để xem. Tạo bản nháp từ
                phiên bản này để thay đổi.
              </p>
            ) : null}
            {isDraft && !mappings.length && state.mappings.isSuccess ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
                Thêm ít nhất một tổ hợp giảng dạy trước khi xuất bản.
              </p>
            ) : null}
          </section>

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <section className="min-w-0 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Cấp học</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Phạm vi học của phiên bản này.
                  </p>
                </div>
                {isDraft ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onContextEditor(null)}
                  >
                    <Plus className="size-4" /> Thêm
                  </Button>
                ) : null}
              </div>
              <div className="mt-4 space-y-2">
                {state.contexts.isPending ? (
                  <div className="h-20 animate-pulse rounded-xl bg-muted" />
                ) : state.contexts.isError ? (
                  <p className="rounded-xl bg-destructive/5 p-4 text-sm text-destructive">
                    Không tải được ngữ cảnh.{" "}
                    <button
                      type="button"
                      className="underline"
                      onClick={() => void state.contexts.refetch()}
                    >
                      Thử lại
                    </button>
                  </p>
                ) : contexts.length ? (
                  contexts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.name || item.code || item.id}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {contextTypeLabels[
                            item.type as keyof typeof contextTypeLabels
                          ] ||
                            item.type ||
                            "Khác"}{" "}
                          · {item.code || "Không có mã"}
                        </p>
                      </div>
                      {isDraft ? (
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Sửa ${item.name}`}
                            onClick={() => onContextEditor(item)}
                          >
                            <PencilSimple className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Xóa ${item.name}`}
                            disabled={mappings.some(
                              (mapping) => mapping.contextId === item.id,
                            )}
                            title={
                              mappings.some(
                                (mapping) => mapping.contextId === item.id,
                              )
                                ? "Xóa tổ hợp sử dụng ngữ cảnh này trước"
                                : "Xóa ngữ cảnh"
                            }
                            onClick={() => onConfirm("deleteContext", item)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    Chưa có ngữ cảnh. Có thể tạo tổ hợp không áp dụng cấp học.
                  </p>
                )}
              </div>
            </section>

            <section className="min-w-0 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Tổ hợp giảng dạy
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Mỗi cấp học / ngữ cảnh có thể áp dụng cho nhiều môn.
                  </p>
                </div>
                {isDraft ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onMappingEditor(null)}
                    disabled={
                      state.teachingItems.isPending ||
                      state.teachingItems.isError ||
                      !teachingItems.length ||
                      !state.contexts.isSuccess ||
                      !state.mappings.isSuccess ||
                      state.isSaving
                    }
                  >
                    <Plus className="size-4" /> Thêm nhiều
                  </Button>
                ) : null}
              </div>
              <div className="mt-4 space-y-2">
                {state.mappings.isPending ? (
                  <div className="h-20 animate-pulse rounded-xl bg-muted" />
                ) : state.mappings.isError ? (
                  <p className="rounded-xl bg-destructive/5 p-4 text-sm text-destructive">
                    Không tải được tổ hợp.{" "}
                    <button
                      type="button"
                      className="underline"
                      onClick={() => void state.mappings.refetch()}
                    >
                      Thử lại
                    </button>
                  </p>
                ) : mappings.length ? (
                  Array.from(mappingsByContext.entries()).map(
                    ([contextId, items]) => (
                      <div
                        key={contextId || "no-context"}
                        className="rounded-xl border border-border p-3"
                      >
                        <p className="text-sm font-bold text-foreground">
                          {contextName(contextId)}
                        </p>
                        <div className="mt-3 space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2"
                            >
                              <span className="min-w-0 text-xs font-medium text-muted-foreground">
                                {itemName(item.teachingItemId)}
                              </span>
                              {isDraft ? (
                                <div className="flex shrink-0 gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Sửa ${contextName(contextId)} - ${itemName(item.teachingItemId)}`}
                                    onClick={() => onMappingEditor(item)}
                                  >
                                    <PencilSimple className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Xóa ${contextName(contextId)} - ${itemName(item.teachingItemId)}`}
                                    onClick={() =>
                                      onConfirm("deleteMapping", item)
                                    }
                                  >
                                    <Trash className="size-4" />
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    Chưa có tổ hợp. Thêm nội dung dạy và ngữ cảnh để gia sư có
                    thể lựa chọn.
                  </p>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
