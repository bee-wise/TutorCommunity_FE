import { BookOpenCheck, History, Rocket, ShieldCheck } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorTeachingHistoryProps {
  tutor: TutorProfileData;
}

export function TutorTeachingHistory({ tutor }: TutorTeachingHistoryProps) {
  const icons = [BookOpenCheck, Rocket, ShieldCheck];

  return (
    <SectionShell
      eyebrow="Kinh nghiệm"
      title="Lịch sử giảng dạy"
      icon={History}
    >
      <div className="space-y-3">
        {tutor.teachingHistory.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-[#cfe1fa] bg-white p-4 transition hover:border-[#280f91]/20 hover:shadow-[0_14px_36px_-28px_rgba(40,15,145,0.24)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#cfe1fa]/55 text-[#280f91]">
                  <Icon size={19} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-6 text-[#0c0c0b]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-[#0c0c0b]/64">
                    {item.detail}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
