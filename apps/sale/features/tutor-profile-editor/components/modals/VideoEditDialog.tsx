"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { FileUploadField } from "../../../tutor-profile-registration/components/FileUploadField";

export function VideoEditDialog({
  videoUrl,
  onClose,
  onSave,
}: {
  videoUrl: string;
  onClose: () => void;
  onSave: (videoUrl: string) => void;
}) {
  const [currentUrl, setCurrentUrl] = useState(videoUrl);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-2xl overflow-hidden rounded-2xl border-[#cfe1fa] bg-white p-0 sm:w-[calc(100vw-2rem)]">
        <div className="border-b border-[#dce7f7] px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-nunito text-xl font-extrabold text-[#17142f] sm:text-2xl">
            Chỉnh sửa video giới thiệu
          </DialogTitle>
          <DialogDescription className="mt-1.5 leading-6 text-[#56516a]">
            Tải video MP4, WebM hoặc QuickTime (tối đa 100 MB). Video giúp học
            viên hiểu rõ phong cách truyền đạt của bạn.
          </DialogDescription>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <FileUploadField
            value={currentUrl}
            folder="intro-videos"
            kind="video"
            onChange={(url: string) => setCurrentUrl(url)}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#dce7f7] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-5"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => onSave(currentUrl)}
            className="rounded-full bg-primary px-5 text-white hover:bg-[#200c76]"
          >
            Lưu video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

