import { Clock3, MapPin, MessageCircleMore, Sparkles } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";

interface TutorStatsProps {
  tutor: TutorProfileData;
}

export function TutorStats({ tutor }: TutorStatsProps) {
  const stats = [
    {
      label: "Học phí",
      value: tutor.hourlyRate,
      icon: Sparkles,
    },
    {
      label: "Hình thức",
      value: tutor.teachingModes.join(" + "),
      icon: MessageCircleMore,
    },
    {
      label: "Khu vực",
      value: tutor.area,
      icon: MapPin,
    },
    {
      label: "Phản hồi",
      value: tutor.responseTime,
      icon: Clock3,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-[0_14px_36px_-30px_rgba(40,15,145,0.2)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#280f91]/8 text-[#280f91]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c0c0b]/42">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-sm font-black text-[#0c0c0b]">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
