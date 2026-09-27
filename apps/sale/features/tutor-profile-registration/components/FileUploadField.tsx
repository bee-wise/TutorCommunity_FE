"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowSquareOut, ImageSquare, Trash, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { tutorProfileRegistrationService } from "../services/profile-registration.service";

export function FileUploadField({
  value,
  folder,
  kind = "image",
  onChange,
}: {
  value: string;
  folder: string;
  kind?: "image" | "video";
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      kind === "video"
        ? tutorProfileRegistrationService.uploadVideo(file, folder, value || undefined)
        : tutorProfileRegistrationService.uploadImage(file, folder, value || undefined),
    onSuccess: (result) => onChange(result.url),
  });
  const deleteMutation = useMutation({
    mutationFn: () => tutorProfileRegistrationService.deleteFile(value),
    onSuccess: () => {
      onChange("");
      setIsDeleteDialogOpen(false);
      toast.success("Đã xóa tệp", {
        description: "Tệp đã được xóa khỏi hệ thống.",
        position: "top-right",
      });
    },
  });

  const accept = kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
  const canPreview = value.startsWith("/") || /^https?:\/\//i.test(value);

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-[#280f91]/30 bg-[#280f91]/3 p-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadMutation.mutate(file);
          event.currentTarget.value = "";
        }}
      />
      <div className={`grid gap-3 ${value || uploadMutation.isPending ? "sm:grid-cols-[minmax(0,1fr)_220px] sm:items-start" : ""}`}>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={uploadMutation.isPending || deleteMutation.isPending}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border-[#280f91]/25 text-[#280f91]"
            >
              <UploadSimple /> {uploadMutation.isPending ? "Đang tải lên..." : value ? "Thay tệp" : "Chọn tệp"}
            </Button>
            <span className="min-w-0 flex-1 text-xs leading-5 text-slate-500">
              {value ? "Tệp đã được tải lên. Bạn có thể xem lại hoặc thay thế tệp." : (kind === "video" ? "MP4, WebM hoặc MOV, tối đa 100 MB" : "JPEG, PNG, GIF, WebP hoặc SVG, tối đa 5 MB")}
            </span>
          </div>
          {value && !canPreview ? <p className="rounded-lg bg-[#fff3cb] px-3 py-2 text-xs text-[#714b0b]">Không thể tạo bản xem trước cho đường dẫn tệp này.</p> : null}
          {uploadMutation.isError ? <p className="text-xs text-red-600">{getApiErrorMessage(uploadMutation.error)}</p> : null}
          {deleteMutation.isError ? <p className="text-xs text-red-600">{getApiErrorMessage(deleteMutation.error, "Chưa thể xóa tệp. Vui lòng thử lại.")}</p> : null}
        </div>

        {uploadMutation.isPending ? (
          <div className="h-32 animate-pulse rounded-xl bg-slate-200" aria-label="Đang tạo bản xem trước" />
        ) : null}
        {value && canPreview && !uploadMutation.isPending ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white sm:justify-self-end">
            {kind === "video" ? (
              <video src={value} controls preload="metadata" className="aspect-video h-28 w-full bg-black object-contain">
                Trình duyệt không hỗ trợ xem trước video.
              </video>
            ) : (
              // The upload host is dynamic, so a native image avoids restricting previews to build-time domains.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Bản xem trước tệp đã tải lên" className="h-28 w-full bg-slate-50 object-contain" />
            )}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-1.5">
              <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-slate-600">
                <ImageSquare className="h-3.5 w-3.5 shrink-0 text-[#447353]" aria-hidden="true" /> Preview
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setIsDeleteDialogOpen(true)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-50">
                  <Trash className="h-3 w-3" aria-hidden="true" /> Xóa
                </button>
                <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-[#280f91] hover:bg-[#280f91]/5">
                  Mở <ArrowSquareOut className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!deleteMutation.isPending) setIsDeleteDialogOpen(open); }}>
        <DialogContent className="rounded-2xl border-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa tệp đã tải lên?</DialogTitle>
            <DialogDescription>Tệp sẽ bị xóa khỏi hệ thống và không thể khôi phục. Bạn có thể tải lên một tệp mới sau đó.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-1 gap-2 sm:space-x-0">
            <Button type="button" variant="outline" disabled={deleteMutation.isPending} onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">Giữ lại</Button>
            <Button type="button" variant="destructive" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()} className="w-full sm:w-auto">
              <Trash /> {deleteMutation.isPending ? "Đang xóa..." : "Xóa tệp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
