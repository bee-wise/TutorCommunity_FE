import Link from "next/link";
import {
  Eye,
  EyeSlash,
  File,
  FolderOpen,
  PencilSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import type { LearningSession, TutorMaterial } from "../types";
import { formatMaterialDate } from "../utils/materials.utils";
import { LibraryStatusBadge, MaterialSourceBadge } from "./MaterialsBadges";

interface MaterialLibraryListProps {
  materials: TutorMaterial[];
  sessions: LearningSession[];
  onEdit: (material: TutorMaterial) => void;
  onToggleHidden: (material: TutorMaterial) => void;
  onToggleDraft: (material: TutorMaterial) => void;
}

export function MaterialLibraryList({ materials, sessions, onEdit, onToggleHidden, onToggleDraft }: MaterialLibraryListProps) {
  if (materials.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-[#280F91]/20 p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-[#280F91]"><FolderOpen size={25} weight="duotone" /></span>
          <h3 className="mt-3 text-base font-extrabold">Chưa có tài liệu phù hợp</h3>
          <p className="mt-1 text-sm text-muted-foreground">Thử đổi bộ lọc hoặc tải lên tài liệu mới.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {materials.map((material) => {
        const session = sessions.find((item) => item.id === material.sessionId);
        const isHidden = material.status === "hidden";
        const isDraft = material.status === "draft";
        return (
          <article key={material.id} className="rounded-xl border border-border p-4 transition-colors hover:border-[#280F91]/20 hover:bg-muted/15">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#CFE1FA]/55 text-[#280F91]"><File size={22} weight="duotone" /></span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5"><MaterialSourceBadge source={material.source} /><LibraryStatusBadge status={material.status} /></div>
                  <h3 className="mt-2 truncate font-extrabold text-foreground">{material.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {session?.subject} - {session?.topic} • {material.fileType}{material.fileSize ? ` • ${material.fileSize}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Cập nhật {formatMaterialDate(material.updatedAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                {material.source === "ai" && (
                  <Link href={`/lms/tutor/materials/${material.sessionId}/preview`} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold hover:bg-muted">
                    <Eye size={16} /> Xem
                  </Link>
                )}
                <button type="button" onClick={() => onEdit(material)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold hover:bg-muted"><PencilSimple size={16} /> Sửa</button>
                <button type="button" onClick={() => onToggleDraft(material)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold text-[#280F91] hover:bg-[#280F91]/8"><UploadSimple size={16} /> {isDraft ? "Chia sẻ" : "Lưu nháp"}</button>
                <button type="button" onClick={() => onToggleHidden(material)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold text-muted-foreground hover:bg-muted">
                  {isHidden ? <Eye size={16} /> : <EyeSlash size={16} />} {isHidden ? "Hiện" : "Ẩn"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

