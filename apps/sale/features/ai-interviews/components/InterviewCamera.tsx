"use client";

import { useEffect, useRef } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export function InterviewCamera({
  stream,
  recording = false,
  className = "",
}: {
  stream: MediaStream | null;
  recording?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    return () => {
      video.srcObject = null;
    };
  }, [stream]);
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-2xl border border-border bg-primary ${className}`}
    >
      <video ref={videoRef} autoPlay muted playsInline aria-label="Hình ảnh camera của bạn" className="h-full w-full object-cover" />
      {!stream ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center text-primary-foreground">
        <VideoCameraIcon aria-hidden="true" className="size-8 opacity-80" />
        <span className="text-sm font-semibold">Chưa kết nối camera</span>
        <span className="max-w-64 text-xs leading-5 text-primary-foreground/80">Hình ảnh của bạn sẽ xuất hiện sau khi cấp quyền camera.</span>
      </div> : <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-3 text-white">
        <span className="flex items-center gap-2 text-xs font-medium"><VideoCameraIcon aria-hidden="true" className="size-4" />Camera của bạn</span>
        {recording && <span className="flex items-center gap-1.5 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold"><span aria-hidden="true" className="size-1.5 rounded-full bg-white motion-safe:animate-pulse" />Đang ghi</span>}
      </div>}
    </div>
  );
}
