import { Eye, Files } from "@phosphor-icons/react";
import type { LearnerSharedMaterial } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { LearnerMaterialBadges } from "./LearnerMaterialBadges";

export function SharedMaterialList({
  materials,
  onView,
}: {
  materials: LearnerSharedMaterial[];
  onView: (material: LearnerSharedMaterial) => void;
}) {
  if (materials.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-14 text-center">
        <Files className="mx-auto text-slate-400" size={34} weight="duotone" />
        <h2 className="mt-3 font-extrabold text-slate-900">Không có tài liệu phù hợp</h2>
        <p className="mt-1 text-sm text-muted-foreground">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-label="Danh sách tài liệu">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h2 className="font-extrabold text-slate-900">Tài liệu được chia sẻ</h2>
        <p className="mt-1 text-sm text-muted-foreground">{materials.length} tài liệu trong kết quả hiện tại</p>
      </div>
      <div className="divide-y divide-border">
        {materials.map((material) => (
          <article key={material.id} className="grid gap-4 px-4 py-5 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <LearnerMaterialBadges source={material.source} fileType={material.fileType} isNew={material.isNew} />
              <h3 className="mt-2.5 font-extrabold text-slate-900">{material.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{material.description}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Chia sẻ {formatLibraryDate(material.sharedAt)}{material.fileSize ? ` • ${material.fileSize}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onView(material)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#280F91]/20 px-4 text-sm font-bold text-[#280F91] transition-colors hover:bg-[#F3F0FF] md:w-auto"
            >
              <Eye size={18} weight="bold" />
              Xem tài liệu
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
