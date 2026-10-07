"use client";

import Link from "next/link";
import type { ClassMaterial } from "../types/class-materials.types";
import { actionClass, outlineActionClass } from "./materials-ui";

export function AIReadyState({ material, readOnly, onPublish }: {
  material: ClassMaterial;
  readOnly: boolean;
  onPublish: () => void;
}) {
  const published = material.status === "published";

  return (
    <section className="mx-auto max-w-xl space-y-6 py-6 text-center" aria-labelledby="ai-ready-title">
      <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${published ? "border-secondary bg-secondary text-secondary-foreground" : "border-primary bg-card text-primary"}`}>
        {published ? "Đã xuất bản cho cả lớp" : "Đã lưu bản nháp"}
      </span>
      <div className="space-y-3">
        <h2 id="ai-ready-title" className="text-2xl leading-[1.25] text-primary [overflow-wrap:anywhere]">{material.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Mở bản xem trước để đọc và chỉnh sửa nội dung trước khi xuất bản.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Kiểm tra và xuất bản tài liệu">
        <Link
          href={`/lms/tutor/materials/${material.sessionId}/preview?materialId=${material.id}&from=ai-modal`}
          className={`${outlineActionClass} min-h-12 w-full`}
        >
          Preview & chỉnh sửa
        </Link>
        <button type="button" className={`${actionClass} w-full`} disabled={published || readOnly} onClick={onPublish}>
          Xuất bản cho cả lớp
        </button>
      </div>
    </section>
  );
}

const navigationActionClass = `${outlineActionClass} w-full sm:w-auto`;

export function AIReadyFooter({ readOnly, onClose, onRestart }: {
  readOnly: boolean;
  onClose: () => void;
  onRestart: () => void;
}) {
  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t border-border px-2 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" className={navigationActionClass} onClick={onClose}>Về không gian tài liệu</button>
      {!readOnly && <button type="button" className={navigationActionClass} onClick={onRestart}>Tạo tài liệu khác</button>}
    </footer>
  );
}
