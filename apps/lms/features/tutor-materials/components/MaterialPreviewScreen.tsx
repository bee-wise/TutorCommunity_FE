"use client";

import { useEffect, useState } from "react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useClassMaterials } from "../hooks/useClassMaterials";
import { usePreviewTransition } from "../hooks/usePreviewTransition";
import { getPreviewReturnHref } from "../utils/preview-navigation.utils";
import { MATERIAL_CLASSES } from "../data/classroom.mock";
import { MATERIAL_STATUS_LABELS } from "../types/class-materials.types";
import type { AIAnalyzeResponse } from "../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { DocumentEditor } from "./DocumentEditor";
import { MaterialConfirmDialog } from "./MaterialConfirmDialog";
import { ClassMaterialsSkeleton } from "./ClassMaterialsSkeleton";
import { MaterialPreviewShell } from "./MaterialPreviewShell";
import { panelClass, actionClass, outlineActionClass } from "./materials-ui";

export function MaterialPreviewScreen({ sessionId, materialId, returnToAI = false }: { sessionId: string; materialId?: string; returnToAI?: boolean }) {
  const library = useClassMaterials();
  const [editing, setEditing] = useState(false);
  const [editVersion, setEditVersion] = useState("");
  const [discardAction, setDiscardAction] = useState<"cancel" | "back" | null>(null);
  const material = library.materials.find((item) => item.sessionId === sessionId && item.data && (!materialId || item.id === materialId));
  const classInfo = MATERIAL_CLASSES.find((item) => item.id === material?.classId);
  const returnHref = getPreviewReturnHref(classInfo?.id, material?.id, returnToAI);
  const transition = usePreviewTransition(returnHref, library.ready);
  const requestBack = () => { if (editing) setDiscardAction("back"); else transition.leave(); };
  const shellProps = { phase: transition.phase, leaving: transition.leaving, onTransitionEnd: transition.onTransitionEnd, onBack: requestBack };
  useEffect(() => {
    if (!editing) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editing]);
  if (!library.ready) return <MaterialPreviewShell {...shellProps}><ClassMaterialsSkeleton workspace /></MaterialPreviewShell>;
  if (!material?.data || !classInfo) return <MaterialPreviewShell {...shellProps}><div className="p-8 text-center"><h1 className="text-2xl text-primary">Không tìm thấy tài liệu</h1><p className="mt-3 text-muted-foreground">Bản nháp có thể chưa được lưu hoặc thuộc một trình duyệt khác.</p><button type="button" onClick={transition.leave} className={`${outlineActionClass} mt-5`}>Về danh sách lớp</button></div></MaterialPreviewShell>;
  const readOnly = classInfo.status === "completed";

  function save(data: AIAnalyzeResponse) {
    if (!material || readOnly) return;
    if (material.updatedAt !== editVersion) {
      toast.warning("Tài liệu đã được cập nhật ở tab khác", { description: "Hãy giữ lại nội dung đang sửa, hủy chỉnh sửa và đọc bản mới trước khi lưu lại." });
      return;
    }
    const normalized = { ...data, summary: { ...data.summary, prerequisites: data.summary.prerequisites.map((item) => item.trim()).filter(Boolean) }, quiz: { ...data.quiz, exercises: data.quiz.exercises.map((exercise) => ({ ...exercise, solution_steps: exercise.solution_steps.map((step, index) => ({ ...step, step_number: index + 1 })) })) } };
    library.updateMaterial(material.id, { data: normalized, title: data.summary.title, status: "draft" });
    setEditing(false);
    toast.success("Đã lưu bản nháp", { description: "Nội dung được đồng bộ về modal và không gian tài liệu. (Lưu cục bộ)" });
  }

  return (
    <MaterialPreviewShell {...shellProps}>
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><span className={`rounded-full border px-3 py-1 text-sm font-bold ${material.status === "published" ? "border-secondary bg-secondary text-secondary-foreground" : "border-border text-primary"}`}>{MATERIAL_STATUS_LABELS[material.status]}</span></div>
        <h1 className="text-2xl leading-[1.25] text-primary">{editing ? "Chỉnh sửa tài liệu" : "Bản xem trước tài liệu"}</h1>
        <p className="text-sm text-muted-foreground">{classInfo.title} · Xuất bản cho {classInfo.learnerIds.length} học viên trong lớp.</p>
        {library.storageError && <p role="alert" className="text-sm text-destructive">{library.storageError}</p>}
        {!readOnly && !editing && <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setEditVersion(material.updatedAt); setEditing(true); }} className={outlineActionClass}>Chỉnh sửa nội dung</button><button type="button" disabled={material.status === "published"} onClick={() => { library.updateMaterial(material.id, { status: "published" }); toast.success("Đã xuất bản cho cả lớp", { description: "Trạng thái được lưu cục bộ và đồng bộ về không gian tài liệu." }); }} className={actionClass}>Xuất bản cho cả lớp</button></div>}
        {readOnly && <p className="text-sm text-muted-foreground">Lớp đã kết thúc. Tài liệu ở chế độ chỉ xem.</p>}
      </header>
      <div className={panelClass}>{editing ? <DocumentEditor key={material.id} data={material.data} onSave={save} onCancel={() => setDiscardAction("cancel")} /> : <DocumentRenderer data={material.data} />}</div>
      <MaterialConfirmDialog open={discardAction !== null} onOpenChange={(value) => { if (!value) setDiscardAction(null); }} title="Bỏ các chỉnh sửa chưa lưu?" description="Nội dung đang chỉnh sửa sẽ không được lưu. Bạn có thể tiếp tục chỉnh sửa hoặc bỏ thay đổi." onConfirm={() => { setEditing(false); if (discardAction === "back") transition.leave(); setDiscardAction(null); }} />
      <p className="text-xs text-muted-foreground">Bản mock lưu tài liệu trên trình duyệt này. Chưa có API lưu hoặc xuất bản tài liệu lên LMS.</p>
    </div>
    </MaterialPreviewShell>
  );
}
