"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { BulkMappingResult } from "../hooks/useLearningProgramsAdmin";
import type {
  BulkMappingFormValues,
  LearningCatalogItem,
  MappingFormValues,
} from "../schemas/learning-program.schema";
import { fieldClass } from "./CatalogDialogs";

type SelectionMode = "by-context" | "by-subject";
type Option = { id: string; label: string; detail: string };

export function BulkMappingDialog({
  open,
  teachingItems,
  contexts,
  mappings,
  busy,
  progress,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  teachingItems: LearningCatalogItem[];
  contexts: LearningCatalogItem[];
  mappings: LearningCatalogItem[];
  busy: boolean;
  progress: { done: number; total: number } | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: BulkMappingFormValues) => Promise<BulkMappingResult>;
}) {
  const [mode, setMode] = useState<SelectionMode>("by-context");
  const [contextId, setContextId] = useState("");
  const [teachingItemId, setTeachingItemId] = useState("");
  const [selectedTeachingItemIds, setSelectedTeachingItemIds] = useState<
    string[]
  >([]);
  const [selectedContextIds, setSelectedContextIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [partialMessage, setPartialMessage] = useState("");

  const contextFirst = mode === "by-context";
  const parentValue = contextFirst ? contextId : teachingItemId;
  const selectedIds = contextFirst
    ? selectedTeachingItemIds
    : selectedContextIds;
  const setSelectedIds = contextFirst
    ? setSelectedTeachingItemIds
    : setSelectedContextIds;

  const subjectOptions: Option[] = teachingItems
    .filter((item) => !item.status || item.status.toUpperCase() === "ACTIVE")
    .map((item) => ({
      id: item.id,
      label: item.name || item.code || item.id,
      detail: item.code || "Nội dung dạy",
    }));
  const contextOptions: Option[] = [
    {
      id: "__none__",
      label: "Không áp dụng cấp học",
      detail: "Dành cho nội dung không cần phân cấp",
    },
    ...contexts.map((item) => ({
      id: item.id,
      label: item.name || item.code || item.id,
      detail: item.code || "Ngữ cảnh",
    })),
  ];
  const parentOptions = contextFirst ? contextOptions : subjectOptions;
  const childOptions = contextFirst ? subjectOptions : contextOptions;
  const existing = new Set(
    mappings
      .filter((mapping) =>
        contextFirst
          ? (mapping.contextId ?? "__none__") === contextId
          : mapping.teachingItemId === teachingItemId,
      )
      .map((mapping) =>
        contextFirst
          ? mapping.teachingItemId
          : (mapping.contextId ?? "__none__"),
      ),
  );
  const available = childOptions.filter((option) => !existing.has(option.id));
  const selectableAll = available.filter(
    (option) => contextFirst || option.id !== "__none__",
  );
  const pendingIds = selectedIds.filter(
    (id) =>
      !existing.has(id) && childOptions.some((option) => option.id === id),
  );

  const close = () => {
    setMode("by-context");
    setContextId("");
    setTeachingItemId("");
    setSelectedTeachingItemIds([]);
    setSelectedContextIds([]);
    setError("");
    setPartialMessage("");
    onOpenChange(false);
  };

  const changeMode = (nextMode: SelectionMode) => {
    setMode(nextMode);
    setContextId("");
    setTeachingItemId("");
    setSelectedTeachingItemIds([]);
    setSelectedContextIds([]);
    setError("");
    setPartialMessage("");
  };

  const toggle = (id: string) => {
    setError("");
    setPartialMessage("");
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (!parentValue) {
      setError(contextFirst ? "Chọn cấp học." : "Chọn môn / nội dung dạy.");
      return;
    }
    if (!pendingIds.length) {
      setError(
        contextFirst
          ? "Chọn ít nhất một môn chưa liên kết với cấp học này."
          : "Chọn ít nhất một cấp học chưa liên kết với môn này.",
      );
      return;
    }

    const selectedMappings: MappingFormValues[] = pendingIds.map((id) =>
      contextFirst
        ? { teachingItemId: id, contextId }
        : { teachingItemId, contextId: id },
    );

    try {
      const result = await onCreate({ mappings: selectedMappings });
      if (!result.failedMappings.length) {
        close();
        return;
      }
      setSelectedIds(
        result.failedMappings.map((mapping) =>
          contextFirst ? mapping.teachingItemId : mapping.contextId,
        ),
      );
      setPartialMessage(
        `Đã thêm ${result.created} tổ hợp. Còn ${result.failedMappings.length} tổ hợp chưa lưu được; bạn có thể thử lại.`,
      );
    } catch {
      setError("Không thể thêm tổ hợp. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) close();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm nhiều tổ hợp</DialogTitle>
          <DialogDescription>
            Chọn cấp học rồi chọn nhiều môn, hoặc chọn một môn cho nhiều cấp
            học. Mỗi lựa chọn tạo một tổ hợp riêng.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
            role="group"
            aria-label="Cách chọn tổ hợp"
          >
            <button
              type="button"
              aria-pressed={contextFirst}
              onClick={() => changeMode("by-context")}
              disabled={busy}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${contextFirst ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Theo cấp học
            </button>
            <button
              type="button"
              aria-pressed={!contextFirst}
              onClick={() => changeMode("by-subject")}
              disabled={busy}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${!contextFirst ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Theo môn
            </button>
          </div>

          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            <span>{contextFirst ? "Cấp học" : "Môn / nội dung dạy"}</span>
            <select
              value={parentValue}
              onChange={(event) => {
                if (contextFirst) setContextId(event.target.value);
                else setTeachingItemId(event.target.value);
                setSelectedIds([]);
                setError("");
                setPartialMessage("");
              }}
              className={fieldClass}
              disabled={busy}
            >
              <option value="">
                {contextFirst ? "Chọn cấp học" : "Chọn môn / nội dung dạy"}
              </option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {parentValue ? (
            <fieldset className="space-y-3" disabled={busy}>
              <legend className="text-sm font-semibold text-foreground">
                {contextFirst ? "Môn / nội dung dạy" : "Cấp học"}
              </legend>
              <div className="flex justify-end gap-3 text-xs font-semibold text-primary">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIds((current) => [
                      ...(!contextFirst && current.includes("__none__")
                        ? ["__none__"]
                        : []),
                      ...selectableAll.map((option) => option.id),
                    ])
                  }
                  disabled={!selectableAll.length || busy}
                  className="disabled:opacity-40"
                >
                  {contextFirst ? "Chọn tất cả môn" : "Chọn tất cả cấp học"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  disabled={!selectedIds.length || busy}
                  className="disabled:opacity-40"
                >
                  Bỏ chọn
                </button>
              </div>
              <div className="max-h-[40dvh] space-y-2 overflow-y-auto pr-1">
                {childOptions.map((option) => {
                  const linked = existing.has(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${linked ? "cursor-not-allowed border-border bg-muted/40 opacity-60" : selectedIds.includes(option.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                    >
                      <input
                        type="checkbox"
                        checked={linked || selectedIds.includes(option.id)}
                        onChange={() => toggle(option.id)}
                        disabled={linked || busy}
                        className="mt-0.5 size-4 accent-primary"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {linked ? "Đã có tổ hợp này" : option.detail}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {!available.length ? (
                <p className="text-xs text-muted-foreground">
                  Tất cả lựa chọn đã được liên kết.
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {error ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          ) : null}
          {partialMessage ? (
            <p
              role="status"
              className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900"
            >
              {partialMessage}
            </p>
          ) : null}
          {busy && progress ? (
            <p role="status" className="text-xs text-muted-foreground">
              Đang lưu {progress.done}/{progress.total} tổ hợp...
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={busy}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={busy || !parentValue || !pendingIds.length}
            >
              {busy ? "Đang lưu..." : `Thêm ${pendingIds.length} tổ hợp`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
