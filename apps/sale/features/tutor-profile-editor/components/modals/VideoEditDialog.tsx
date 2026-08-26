"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { validatePreviewFile } from "../../utils/file-preview";

const videoRule = {
  acceptedTypes: ["video/mp4", "video/webm"],
  maxBytes: 50 * 1024 * 1024,
};

export function VideoEditDialog({
  videoUrl,
  onClose,
  onSave,
}: {
  videoUrl: string;
  onClose: () => void;
  onSave: (videoUrl: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState(videoUrl);
  const [fileError, setFileError] = useState<string | null>(null);
  const generatedUrl = useRef<string | null>(null);
  const committed = useRef(false);

  useEffect(
    () => () => {
      if (!committed.current && generatedUrl.current) {
        URL.revokeObjectURL(generatedUrl.current);
      }
    },
    [],
  );

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const error = validatePreviewFile(file, videoRule);
    setFileError(error);
    if (error) return;
    if (generatedUrl.current) URL.revokeObjectURL(generatedUrl.current);
    generatedUrl.current = URL.createObjectURL(file);
    setPreviewUrl(generatedUrl.current);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-2xl overflow-hidden rounded-2xl border-[#cfe1fa] bg-white p-0 sm:w-[calc(100vw-2rem)]">
        <div className="border-b border-[#dce7f7] px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-nunito text-xl font-extrabold text-[#17142f] sm:text-2xl">
            Chỉnh sửa video giới thiệu
          </DialogTitle>
          <DialogDescription className="mt-1.5 leading-6 text-[#56516a]">
            Tải video MP4 hoặc WEBM, tối đa 50 MB và xem trước trước khi lưu.
          </DialogDescription>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:px-6">
          <video
            key={previewUrl}
            src={previewUrl}
            controls
            preload="metadata"
            className="aspect-video w-full rounded-2xl bg-black object-contain"
          >
            Trình duyệt không hỗ trợ phát video.
          </video>
          <div>
            <label htmlFor="profile-video-file" className="text-sm font-bold text-[#17142f]">
              Tệp video
            </label>
            <input
              id="profile-video-file"
              type="file"
              accept="video/mp4,video/webm"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
              className="mt-2 block w-full text-xs text-[#56516a] file:mr-3 file:rounded-full file:border-0 file:bg-[#280f91] file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-[#200c76]"
            />
            {fileError ? (
              <p role="alert" className="mt-2 text-xs font-semibold text-[#9f2017]">
                {fileError}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#dce7f7] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-5">
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => {
              committed.current = true;
              onSave(previewUrl);
            }}
            className="rounded-full bg-[#280f91] px-5 text-white hover:bg-[#200c76]"
          >
            Lưu video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
