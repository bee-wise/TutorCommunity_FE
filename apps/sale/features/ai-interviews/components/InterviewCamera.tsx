"use client";

import { useEffect, useRef } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export function InterviewCamera({ stream }: { stream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    return () => { video.srcObject = null; };
  }, [stream]);
  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-muted">
      <video ref={videoRef} autoPlay muted playsInline aria-label="Hình ảnh camera của bạn" className="h-full w-full object-cover" />
      {!stream && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground"><VideoCameraIcon className="h-8 w-8" /><span className="text-sm">Chưa kết nối camera</span></div>}
    </div>
  );
}
