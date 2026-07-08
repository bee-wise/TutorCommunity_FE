import { Play, PlayCircle } from "lucide-react";
import { SectionShell } from "./TutorProfilePrimitives";

export function TutorIntroVideo() {
  return (
    <SectionShell eyebrow="Video" title="Giới thiệu nhanh" icon={PlayCircle}>
      <div className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-[#cfe1fa]/22 p-3 sm:p-4">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#cfe1fa] bg-[linear-gradient(135deg,#cfe1fa_0%,#ffffff_48%,#fff3cb_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(40,15,145,0.18),transparent_28%),radial-gradient(circle_at_85%_78%,rgba(68,115,83,0.16),transparent_30%)]" />
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-[#280f91]/10 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#280f91] shadow-sm">
                16:9
              </span>
              <span className="rounded-full bg-[#447353] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                Sắp có video
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#280f91] text-white shadow-xl shadow-[#280f91]/20 transition hover:scale-105"
                aria-label="Phát video giới thiệu"
              >
                <Play size={26} fill="currentColor" aria-hidden="true" />
              </button>
              <p className="mt-4 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 text-sm font-bold text-[#0c0c0b] shadow-sm backdrop-blur">
                Gia sư chia sẻ phong cách dạy và kỳ vọng học tập.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
