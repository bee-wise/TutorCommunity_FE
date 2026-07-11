import { CheckCircle2, GraduationCap, Trophy } from "lucide-react";
import type { TutorProfileData } from "../data/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorEducationAchievementsProps {
  tutor: TutorProfileData;
}

export function TutorEducationAchievements({
  tutor,
}: TutorEducationAchievementsProps) {
  return (
    <SectionShell
      eyebrow="Hồ sơ học thuật"
      title="Học vấn và thành tích"
      icon={GraduationCap}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-[#0c0c0b]">
            <GraduationCap size={17} className="text-[#280f91]" />
            Học vấn
          </div>
          <div className="mt-4 space-y-3">
            {tutor.education.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7 text-[#0c0c0b]/70"
              >
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#447353]"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#ffc510] bg-[#fadc78]/65 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-[#0c0c0b]">
            <Trophy size={17} className="text-[#905b0f]" />
            Thành tích
          </div>
          <div className="mt-4 space-y-3">
            {tutor.achievements.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7 text-[#0c0c0b]/70"
              >
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#447353]"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
