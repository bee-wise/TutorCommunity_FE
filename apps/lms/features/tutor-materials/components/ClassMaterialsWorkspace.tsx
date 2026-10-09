"use client";

import { useState } from "react";
import Link from "next/link";
import { useClassMaterials } from "../hooks/useClassMaterials";
import { useAIJobsStore } from "../store/ai-jobs.store";
import { CLASS_SESSIONS, MATERIAL_CLASSES } from "../data/classroom.mock";
import { ClassUploadSpace } from "./ClassUploadSpace";
import { ClassLearnersPanel } from "./ClassLearnersPanel";
import { ClassMaterialRow } from "./ClassMaterialRow";
import { ClassAIFlowModal } from "./ClassAIFlowModal";
import { MaterialsSelect } from "./MaterialsSelect";
import { ClassMaterialsSkeleton } from "./ClassMaterialsSkeleton";
import { AIActionButton } from "./AIActionButton";
import { panelClass, outlineActionClass } from "./materials-ui";

export function ClassMaterialsWorkspace({
  classId,
  initialMaterialId,
  initialSessionId,
}: {
  classId: string;
  initialMaterialId?: string;
  initialSessionId?: string;
}) {
  const library = useClassMaterials();
  const job = useAIJobsStore((state) => state.jobs[classId]);
  const [aiOpen, setAiOpen] = useState(Boolean(initialMaterialId));
  const [source, setSource] = useState("all");
  const [status, setStatus] = useState("all");
  const [sessionFilter, setSessionFilter] = useState(initialSessionId ?? "all");
  const classInfo = MATERIAL_CLASSES.find((item) => item.id === classId);
  if (!library.ready) return <ClassMaterialsSkeleton workspace />;
  if (!classInfo)
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl text-primary">Không tìm thấy lớp học</h1>
        <Link
          href="/lms/tutor/classes"
          className={`${outlineActionClass} mt-5`}
        >
          Về danh sách lớp
        </Link>
      </div>
    );
  const sessions = CLASS_SESSIONS.filter((item) => item.classId === classId);
  const materials = library.materials.filter(
    (item) => item.classId === classId,
  );
  const filtered = materials
    .filter(
      (item) =>
        (source === "all" || item.source === source) &&
        (status === "all" || item.status === status) &&
        (sessionFilter === "all" || item.sessionId === sessionFilter),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const missing = sessions.filter(
    (session) =>
      session.completed &&
      !materials.some(
        (item) => item.sessionId === session.id && item.status === "published",
      ),
  );
  const readOnly = classInfo.status === "completed";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl leading-[1.25] text-primary sm:text-3xl">
            Quản lý tài liệu
          </h1>
        </div>
        <AIActionButton
          onClick={() => setAiOpen(true)}
          disabled={readOnly || !sessions.some((item) => item.completed)}
        >
          {job?.status === "running" ? "Theo dõi AI" : "Tạo tài liệu AI"}
        </AIActionButton>
      </header>
      {library.storageError && (
        <p role="alert" className="text-sm text-destructive">
          {library.storageError}
        </p>
      )}
      {readOnly && (
        <p className="rounded-full border border-border px-4 py-3 text-sm text-muted-foreground">
          Lớp đã kết thúc. Không gian tài liệu ở chế độ chỉ xem.
        </p>
      )}
      {job && (
        <div
          className={`${panelClass} flex flex-wrap items-center justify-between gap-3`}
          role="status"
        >
          <p className="text-sm font-bold text-primary">
            {job.status === "running"
              ? "BeeWise AI đang tạo tài liệu trong nền. Không đóng hoặc tải lại tab."
              : job.status === "ready"
                ? "Tài liệu AI đã sẵn sàng để kiểm tra và xuất bản."
                : `Tạo tài liệu chưa thành công: ${job.error}`}
          </p>
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className={outlineActionClass}
          >
            Mở cửa sổ AI
          </button>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <ClassUploadSpace classInfo={classInfo} sessions={sessions} />
          </div>
          <section className={panelClass} aria-labelledby="class-library-title">
            <h2
              id="class-library-title"
              className="text-xl leading-[1.25] text-primary"
            >
              Danh sách tài liệu ({materials.length})
            </h2>
            {missing.length > 0 && (
              <div className="mt-4 rounded-2xl border border-accent p-3 text-sm text-warning">
                <p className="font-bold">
                  {missing.length} buổi chưa có tài liệu đã xuất bản
                </p>
                <p className="mt-1">
                  {missing.map((session) => session.topic).join(", ")}
                </p>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-border p-3 xl:grid-cols-3">
              <MaterialsSelect
                compact
                label="Nguồn tài liệu"
                value={source}
                onChange={setSource}
                options={[
                  { value: "all", label: "Mọi nguồn" },
                  { value: "ai", label: "Tạo bằng AI" },
                  { value: "upload", label: "Upload thủ công" },
                ]}
              />
              <MaterialsSelect
                compact
                label="Trạng thái tài liệu"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "Mọi trạng thái" },
                  { value: "draft", label: "Bản nháp" },
                  { value: "published", label: "Đã xuất bản" },
                  { value: "hidden", label: "Đang ẩn" },
                ]}
              />
              <div className="col-span-2 min-w-0 xl:col-span-1"><MaterialsSelect
                compact
                label="Buổi học"
                value={sessionFilter}
                onChange={setSessionFilter}
                options={[
                  { value: "all", label: "Tất cả buổi học" },
                  ...sessions.map((session) => ({
                    value: session.id,
                    label: session.topic,
                  })),
                ]}
              /></div>
            </div>
            <div className="mt-4 space-y-3">
              {filtered.map((material) => (
                <ClassMaterialRow
                  key={material.id}
                  material={material}
                  readOnly={readOnly}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                Chưa có tài liệu phù hợp. Thử thay đổi bộ lọc hoặc thêm tài liệu
                cho lớp.
              </p>
            )}
          </section>
        </div>
        <ClassLearnersPanel classInfo={classInfo} />
      </div>
      <ClassAIFlowModal
        classInfo={classInfo}
        open={aiOpen}
        onOpenChange={setAiOpen}
        initialMaterialId={initialMaterialId}
        initialSessionId={initialSessionId}
      />
    </div>
  );
}
