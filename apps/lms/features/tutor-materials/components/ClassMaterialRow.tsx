"use client";

import Link from "next/link";
import Image from "next/image";
import aiIcon from "../../../../sale/public/icons/AI-icon.svg";
import { useState } from "react";
import {
  BookmarkSimple,
  DotsThreeVertical,
  DownloadSimple,
  Eye,
  EyeSlash,
  PencilSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import { useClassMaterialsStore } from "../store/class-materials.store";
import { MATERIAL_STATUS_LABELS, type ClassMaterial } from "../types/class-materials.types";
import { useLocalMaterialFile } from "../hooks/useLocalMaterialFile";
import { formatMaterialDate } from "../utils/materials.utils";
import { actionClass, outlineActionClass, inputClass } from "./materials-ui";

export function ClassMaterialRow({ material, readOnly }: { material: ClassMaterial; readOnly: boolean }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(material.title);
  const update = useClassMaterialsStore((state) => state.updateMaterial);
  const { url, error } = useLocalMaterialFile(material.id, material.hasLocalFile);

  return (
    <article className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {material.source === "ai" ? (
              <Image src={aiIcon} alt="Tài liệu tạo bằng AI" width={32} height={32} className="size-8 shrink-0 object-contain" />
            ) : (
              <span className="rounded-full border border-primary px-3 py-1 text-primary">Upload thủ công</span>
            )}
            <span
              className={`rounded-full border px-3 py-1 ${
                material.status === "published"
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {MATERIAL_STATUS_LABELS[material.status]}
            </span>
          </div>
          <h3 className="text-lg leading-[1.25] text-primary [overflow-wrap:anywhere]">{material.title}</h3>
          <p className="text-xs text-muted-foreground">
            {material.fileType}
            {material.fileSize ? ` · ${material.fileSize}` : ""}
          </p>
          <p className="text-xs text-muted-foreground">Cập nhật {formatMaterialDate(material.updatedAt)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {material.data && (
            <Link
              href={`/lms/tutor/materials/${material.sessionId}/preview?materialId=${material.id}`}
              className={`${outlineActionClass} hidden sm:inline-flex`}
            >
              Preview & chỉnh sửa
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Thao tác tài liệu"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <DotsThreeVertical size={20} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border bg-card p-1.5 shadow-pop">
              {material.data && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/lms/tutor/materials/${material.sessionId}/preview?materialId=${material.id}`}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <Eye size={16} weight="bold" />
                    <span>Preview & chỉnh sửa</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {url && (
                <DropdownMenuItem asChild>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={material.fileType !== "PDF" ? `${material.title}.${material.fileType.toLowerCase()}` : undefined}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <DownloadSimple size={16} weight="bold" />
                    <span>{material.fileType === "PDF" ? "Mở tài liệu (PDF)" : "Tải tài liệu"}</span>
                  </a>
                </DropdownMenuItem>
              )}

              {!readOnly && (
                <>
                  {(material.data || url) && <DropdownMenuSeparator className="my-1 border-border" />}

                  <DropdownMenuItem
                    onClick={() => {
                      setTitle(material.title);
                      setEditing(true);
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <PencilSimple size={16} weight="bold" />
                    <span>Đổi tên</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      const nextStatus = material.status === "published" ? "hidden" : "published";
                      update(material.id, { status: nextStatus });
                      toast.success(nextStatus === "published" ? "Đã xuất bản cho cả lớp" : "Đã ẩn tài liệu", {
                        description: "Cập nhật trong bản mock cục bộ.",
                      });
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {material.status === "published" ? (
                      <>
                        <EyeSlash size={16} weight="bold" />
                        <span>Ẩn tài liệu</span>
                      </>
                    ) : (
                      <>
                        <UploadSimple size={16} weight="bold" />
                        <span className="text-primary font-bold">Xuất bản</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  {material.status !== "draft" && (
                    <DropdownMenuItem
                      onClick={() => {
                        update(material.id, { status: "draft" });
                        toast.success("Đã chuyển về bản nháp", { description: "Cập nhật trong bản mock cục bộ." });
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      <BookmarkSimple size={16} weight="bold" />
                      <span>Lưu nháp</span>
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            update(material.id, { title: title.trim() });
            setEditing(false);
          }}
          className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row"
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Tên tài liệu</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={200}
              className={inputClass}
            />
          </label>
          <button type="submit" className={actionClass}>Lưu tên</button>
          <button type="button" onClick={() => setEditing(false)} className={outlineActionClass}>Hủy</button>
        </form>
      )}
      {material.source === "upload" && !material.hasLocalFile && (
        <p className="text-xs text-muted-foreground">Tệp mẫu chưa có nội dung thực tế để mở.</p>
      )}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </article>
  );
}
