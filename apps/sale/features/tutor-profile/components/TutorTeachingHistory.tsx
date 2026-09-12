import { CheckCircle, Trophy } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorTeachingHistoryProps {
  tutor: TutorProfileData;
}

export function TutorTeachingHistory({ tutor }: TutorTeachingHistoryProps) {
  const history = tutor.teachingHistory || [];

  return (
    <SectionShell
      title="Lịch sử & Kinh nghiệm giảng dạy"
      description="Các lớp học tiêu biểu và kết quả tiến bộ thực tế của học viên"
    >
      {history.length > 0 ? (
        <div className="relative pl-6 sm:pl-8">
          {/* Vertical timeline bar */}
          <div className="absolute bottom-3 left-2.5 top-3 w-0.5 bg-[#e8edf5] sm:left-3.5" />

          <div className="space-y-6">
            {history.map((item, index) => (
              <div key={`${item.title}-${index}`} className="relative">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#280f91] text-white shadow-xs sm:-left-8 sm:h-7 sm:w-7">
                  <CheckCircle size={14} className="hidden sm:block" aria-hidden="true" />
                  <span className="block h-2 w-2 rounded-full bg-white sm:hidden" />
                </div>

                {/* Content Box */}
                <div className="rounded-2xl border border-[#e8edf5] bg-white p-4.5 sm:p-5 shadow-xs transition hover:border-[#280f91]/25 hover:shadow-sm">
                  <h3 className="text-base font-extrabold text-[#0c0c0b]">
                    {item.title}
                  </h3>

                  {item.detail ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-[#0c0c0b]/70">
                      {item.detail}
                    </p>
                  ) : null}

                  {item.outcome ? (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#447353]/25 bg-[#447353]/8 p-3 text-xs sm:text-sm font-bold text-[#447353]">
                      <Trophy size={16} className="shrink-0 text-[#447353]" aria-hidden="true" />
                      <span>Kết quả: {item.outcome}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#0c0c0b]/50">
          Chưa có thông tin lịch sử giảng dạy.
        </p>
      )}
    </SectionShell>
  );
}

