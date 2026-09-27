"use client";

import { Play, Video } from "lucide-react";
import { SectionShell } from "./TutorProfilePrimitives";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog";

const DEFAULT_INTRO_VIDEO_SRC = "/video/videoplayback.mp4#t=0.1";

interface TutorIntroVideoProps {
  videoUrl?: string;
}

export function TutorIntroVideo({ videoUrl }: TutorIntroVideoProps) {
  const activeVideoSrc = videoUrl || DEFAULT_INTRO_VIDEO_SRC;

  return (
    <SectionShell
      title="Video giới thiệu"
      description="Lắng nghe gia sư chia sẻ trực tiếp về phương pháp và định hướng học tập"
    >
      <div className="overflow-hidden rounded-2xl border border-[#e8edf5] bg-[#f8faff] p-3 sm:p-4">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0c0c0b]/90 shadow-inner">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            src={activeVideoSrc}
            preload="metadata"
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

          {/* Top tag */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Video size={13} aria-hidden="true" />
            <span>Video tự giới thiệu</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#280f91] text-white shadow-2xl shadow-[#280f91]/50 transition duration-300 hover:scale-110 hover:bg-[#3815c4] active:scale-95"
                  aria-label="Phát video giới thiệu"
                >
                  <Play
                    size={24}
                    fill="currentColor"
                    className="translate-x-0.5 transition-transform group-hover:scale-105"
                    aria-hidden="true"
                  />
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                <div className="w-full">
                  <video
                    className="h-auto w-full rounded-lg bg-black"
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                  >
                    <source src={activeVideoSrc} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ phát video.
                  </video>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className="mt-3 text-center text-xs sm:text-sm text-[#0c0c0b]/55">
          Gia sư chia sẻ phong cách dạy, phương châm học tập và kỳ vọng kết quả.
        </p>
      </div>
    </SectionShell>
  );
}

