"use client";

import { useState } from "react";
import {
  ArrowClockwise,
  Books,
  ChalkboardTeacher,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  useLearningProgramsAdmin,
  type LearningAdminAction,
} from "../hooks/useLearningProgramsAdmin";
import {
  getProgramTypeLabel,
  type LearningCatalogItem,
} from "../schemas/learning-program.schema";
import { ProgramDialog, TeachingItemDialog } from "./CatalogDialogs";
import { VersionDialog } from "./VersionDialog";
import {
  ContextDialog,
  MappingDialog,
  ConfirmActionDialog,
} from "./OfferingDialogs";
import { ProgramWorkspace } from "./ProgramWorkspace";
import { ProgramTypeDialog } from "./ProgramTypeDialog";
import { ProgramTypesPanel } from "./ProgramTypesPanel";
import { TeachingItemsPanel } from "./TeachingItemsPanel";
import { BulkMappingDialog } from "./BulkMappingDialog";

type Editor =
  | { kind: "programType"; item: LearningCatalogItem | null }
  | { kind: "program"; item: LearningCatalogItem | null }
  | { kind: "teachingItem"; item: LearningCatalogItem | null }
  | {
      kind: "version";
      mode: "create" | "edit" | "clone";
      item: LearningCatalogItem | null;
    }
  | { kind: "context"; item: LearningCatalogItem | null }
  | { kind: "mapping"; item: LearningCatalogItem }
  | { kind: "bulkMapping" };
type Confirmation = {
  action: LearningAdminAction;
  title: string;
  description: string;
  actionLabel: string;
};

export function LearningProgramsScreen() {
  const state = useLearningProgramsAdmin();
  const [tab, setTab] = useState<
    "programs" | "program-types" | "teaching-items"
  >("programs");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const programItems = (state.programs.data ?? []).filter((item) =>
    `${item.name ?? ""} ${item.code ?? ""}`
      .toLocaleLowerCase("vi")
      .includes(search.trim().toLocaleLowerCase("vi")),
  );
  const selectedProgram = editor?.kind === "program" ? editor.item : null;
  const selectedProgramType =
    editor?.kind === "programType" ? editor.item : null;
  const selectedTeachingItem =
    editor?.kind === "teachingItem" ? editor.item : null;
  const selectedVersion = editor?.kind === "version" ? editor.item : null;
  const selectedContext = editor?.kind === "context" ? editor.item : null;
  const selectedMapping = editor?.kind === "mapping" ? editor.item : null;

  const confirmVersionAction = (
    kind:
      | "deleteVersion"
      | "publishVersion"
      | "deleteContext"
      | "deleteMapping",
    item: LearningCatalogItem,
  ) => {
    if (kind === "publishVersion")
      setConfirmation({
        action: { kind, id: item.id },
        title: "Xuất bản phiên bản?",
        description:
          "Phiên bản nháp sẽ trở thành phiên bản đang áp dụng. Phiên bản đang áp dụng trước đó sẽ được lưu trữ và không thể sửa trực tiếp.",
        actionLabel: "Xuất bản",
      });
    if (kind === "deleteVersion")
      setConfirmation({
        action: { kind, id: item.id },
        title: "Xóa phiên bản nháp?",
        description:
          "Phiên bản nháp cùng context và các tổ hợp trong đó sẽ bị xóa.",
        actionLabel: "Xóa bản nháp",
      });
    if (kind === "deleteContext")
      setConfirmation({
        action: { kind, id: item.id },
        title: "Xóa cấp học?",
        description: `“${item.name || item.code || "Ngữ cảnh"}” sẽ được xóa khỏi bản nháp này.`,
        actionLabel: "Xóa ngữ cảnh",
      });
    if (kind === "deleteMapping")
      setConfirmation({
        action: { kind, id: item.id },
        title: "Xóa tổ hợp?",
        description:
          "Tổ hợp này sẽ được xóa khỏi bản nháp và không xuất hiện trong phiên bản khi xuất bản.",
        actionLabel: "Xóa tổ hợp",
      });
  };

  return (
    <main className="min-h-[100dvh] bg-muted/40 px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Danh mục giảng dạy
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Chương trình & tổ hợp dạy
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Cấu hình chương trình, môn dạy và các tổ hợp hợp lệ để gia sư chọn
              khi đăng ký hồ sơ.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void state.reload()}
            disabled={state.isSaving}
          >
            <ArrowClockwise className="size-4" /> Tải lại
          </Button>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-xs font-black text-primary">
              L
            </span>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {state.programTypes.data?.length ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">Loại chương trình</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <Books className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-bold text-foreground">
              {state.programs.data?.length ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">Chương trình học</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <ChalkboardTeacher className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-bold text-foreground">
              {state.teachingItems.data?.length ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">Nội dung dạy</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="flex size-5 items-center justify-center rounded-md bg-amber-100 text-xs font-black text-amber-800">
              V
            </span>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {state.versions.data?.length ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              Phiên bản của chương trình đang chọn
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 border-b border-border pb-3"
          role="tablist"
          aria-label="Danh mục cấu hình"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "programs"}
            onClick={() => setTab("programs")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "programs" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
          >
            Chương trình & phiên bản
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "program-types"}
            onClick={() => setTab("program-types")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "program-types" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
          >
            Loại chương trình
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "teaching-items"}
            onClick={() => setTab("teaching-items")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "teaching-items" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
          >
            Nội dung dạy
          </button>
        </div>

        {tab === "programs" ? (
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:items-start">
            <aside className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-foreground">Chương trình</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Tạo chương trình"
                  onClick={() => setEditor({ kind: "program", item: null })}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm chương trình..."
                aria-label="Tìm chương trình"
                className="mt-4 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              {state.programs.isPending ? (
                <div className="mt-4 space-y-2">
                  <div className="h-16 animate-pulse rounded-xl bg-muted" />
                  <div className="h-16 animate-pulse rounded-xl bg-muted" />
                </div>
              ) : state.programs.isError ? (
                <div className="mt-4 rounded-xl bg-destructive/5 p-4 text-sm text-destructive">
                  Không tải được chương trình.{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => void state.programs.refetch()}
                  >
                    Thử lại
                  </button>
                </div>
              ) : programItems.length ? (
                <div className="mt-3 max-h-[65dvh] space-y-2 overflow-y-auto pr-1">
                  {programItems.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition ${item.id === state.currentProgramId ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <button
                        type="button"
                        onClick={() => state.chooseProgram(item.id)}
                        className="w-full p-3 text-left"
                      >
                        <span className="block truncate text-sm font-bold text-foreground">
                          {item.name || item.code || "Chưa đặt tên"}
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {getProgramTypeLabel(
                            item.type,
                            state.programTypes.data,
                          )}
                        </span>
                        <span
                          className={`mt-2 inline-block text-[11px] font-semibold ${item.status?.toUpperCase() === "ACTIVE" ? "text-emerald-700" : "text-muted-foreground"}`}
                        >
                          {item.status || "Chưa rõ trạng thái"}
                        </span>
                      </button>
                      <div className="flex justify-end gap-1 border-t border-border/60 px-2 py-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditor({ kind: "program", item })}
                        >
                          <PencilSimple className="size-3.5" /> Sửa
                        </Button>
                        {item.status?.toUpperCase() === "ACTIVE" ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setConfirmation({
                                action: {
                                  kind: "deactivateProgram",
                                  id: item.id,
                                },
                                title: "Ngừng hoạt động chương trình?",
                                description: `“${item.name || item.code}” sẽ không còn xuất hiện để gia sư chọn.`,
                                actionLabel: "Ngừng hoạt động",
                              })
                            }
                          >
                            <Trash className="size-3.5" /> Ẩn
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setConfirmation({
                                action: { kind: "activateProgram", item },
                                title: "Kích hoạt chương trình?",
                                description: `“${item.name || item.code}” sẽ lại xuất hiện trong danh mục chương trình.`,
                                actionLabel: "Kích hoạt",
                              })
                            }
                          >
                            Kích hoạt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  {search
                    ? "Không có chương trình khớp tìm kiếm."
                    : "Chưa có chương trình. Nhấn + để tạo chương trình đầu tiên."}
                </p>
              )}
            </aside>
            <ProgramWorkspace
              state={state}
              onVersionEditor={(value) =>
                setEditor({ kind: "version", ...value })
              }
              onContextEditor={(item) => setEditor({ kind: "context", item })}
              onMappingEditor={(item) =>
                setEditor(
                  item ? { kind: "mapping", item } : { kind: "bulkMapping" },
                )
              }
              onConfirm={confirmVersionAction}
            />
          </div>
        ) : tab === "program-types" ? (
          <ProgramTypesPanel
            state={state}
            onEdit={(item) => setEditor({ kind: "programType", item })}
            onDeactivate={(item) =>
              setConfirmation({
                action: { kind: "deactivateProgramType", id: item.id },
                title: "Ngừng hoạt động loại chương trình?",
                description: `“${item.name || item.code}” sẽ không còn xuất hiện khi tạo chương trình mới. Các chương trình hiện có vẫn giữ loại này.`,
                actionLabel: "Ngừng hoạt động",
              })
            }
            onActivate={(item) =>
              setConfirmation({
                action: { kind: "activateProgramType", item },
                title: "Kích hoạt loại chương trình?",
                description: `“${item.name || item.code}” sẽ xuất hiện trở lại khi cấu hình chương trình.`,
                actionLabel: "Kích hoạt",
              })
            }
          />
        ) : (
          <TeachingItemsPanel
            state={state}
            onEdit={(item) => setEditor({ kind: "teachingItem", item })}
            onDeactivate={(item) =>
              setConfirmation({
                action: { kind: "deactivateTeachingItem", id: item.id },
                title: "Ngừng hoạt động nội dung dạy?",
                description: `“${item.name || item.code}” sẽ không còn có thể chọn cho tổ hợp mới.`,
                actionLabel: "Ngừng hoạt động",
              })
            }
            onActivate={(item) =>
              setConfirmation({
                action: { kind: "activateTeachingItem", item },
                title: "Kích hoạt nội dung dạy?",
                description: `“${item.name || item.code}” sẽ lại có thể dùng trong tổ hợp mới.`,
                actionLabel: "Kích hoạt",
              })
            }
          />
        )}
      </div>

      <ProgramDialog
        open={editor?.kind === "program"}
        item={selectedProgram}
        busy={state.isSaving}
        availableTypes={state.activeProgramTypes.data ?? []}
        allTypes={state.programTypes.data ?? []}
        typesPending={state.activeProgramTypes.isPending}
        typesError={state.activeProgramTypes.isError}
        onRetryTypes={() => void state.activeProgramTypes.refetch()}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            selectedProgram
              ? { kind: "updateProgram", id: selectedProgram.id, values }
              : { kind: "createProgram", values },
          )
        }
      />
      <ProgramTypeDialog
        open={editor?.kind === "programType"}
        item={selectedProgramType}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            selectedProgramType
              ? { kind: "updateProgramType", item: selectedProgramType, values }
              : { kind: "createProgramType", values },
          )
        }
      />
      <TeachingItemDialog
        open={editor?.kind === "teachingItem"}
        item={selectedTeachingItem}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            selectedTeachingItem
              ? {
                  kind: "updateTeachingItem",
                  id: selectedTeachingItem.id,
                  values,
                }
              : { kind: "createTeachingItem", values },
          )
        }
      />
      <VersionDialog
        open={editor?.kind === "version"}
        mode={editor?.kind === "version" ? editor.mode : "create"}
        item={selectedVersion}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            editor?.kind === "version" &&
              editor.mode === "clone" &&
              selectedVersion
              ? { kind: "cloneVersion", id: selectedVersion.id, values }
              : editor?.kind === "version" &&
                  editor.mode === "edit" &&
                  selectedVersion
                ? { kind: "updateVersion", id: selectedVersion.id, values }
                : { kind: "createVersion", values },
          )
        }
      />
      <ContextDialog
        open={editor?.kind === "context"}
        item={selectedContext}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            selectedContext
              ? { kind: "updateContext", id: selectedContext.id, values }
              : { kind: "createContext", values },
          )
        }
      />
      <MappingDialog
        open={editor?.kind === "mapping"}
        item={selectedMapping}
        teachingItems={state.teachingItems.data ?? []}
        contexts={state.contexts.data ?? []}
        mappings={state.mappings.data ?? []}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={(values) =>
          state.runAction(
            selectedMapping
              ? { kind: "updateMapping", id: selectedMapping.id, values }
              : { kind: "createMapping", values },
          )
        }
      />
      <BulkMappingDialog
        open={editor?.kind === "bulkMapping"}
        teachingItems={state.teachingItems.data ?? []}
        contexts={state.contexts.data ?? []}
        mappings={state.mappings.data ?? []}
        busy={state.isSaving}
        progress={state.mappingBatchProgress}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onCreate={state.runCreateMappings}
      />
      <ConfirmActionDialog
        open={Boolean(confirmation)}
        title={confirmation?.title ?? ""}
        description={confirmation?.description ?? ""}
        actionLabel={confirmation?.actionLabel ?? ""}
        busy={state.isSaving}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
        onConfirm={() =>
          confirmation
            ? state.runAction(confirmation.action)
            : Promise.resolve()
        }
      />
    </main>
  );
}
