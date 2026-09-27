import Image from "next/image";
import { GraduationCap, BookOpen, Briefcase, Award, CheckCircle2 } from "lucide-react";
import type { TutorAchievementItem, TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorAchievementsProps {
  tutor: TutorProfileData;
}

const statusColor: Record<string, { badge: string; icon: string }> = {
  "Đã xác minh": {
    badge: "border-[#447353]/30 bg-[#447353]/10 text-[#447353]",
    icon: "text-[#447353]",
  },
  "Đã duyệt": {
    badge: "border-[#280f91]/20 bg-[#280f91]/10 text-[#280f91]",
    icon: "text-[#280f91]",
  },
  "Đã rà soát": {
    badge: "border-[#ffc510]/60 bg-[#fff8e6] text-[#905b0f]",
    icon: "text-[#905b0f]",
  },
};

function AchievementCard({ item }: { item: TutorAchievementItem }) {
  const statusConfig = item.status && statusColor[item.status]
    ? statusColor[item.status]
    : {
        badge: "border-[#e8edf5] bg-white text-[#0c0c0b]/50",
        icon: "text-[#0c0c0b]/40",
      };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8edf5] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#280f91]/25 hover:shadow-md hover:shadow-[#280f91]/6">
      {item.imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden bg-[#f5f8ff]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {item.status ? (
            <span
              className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold backdrop-blur-sm ${statusConfig.badge} bg-white/95`}
            >
              <CheckCircle2 size={12} className={statusConfig.icon} aria-hidden="true" />
              {item.status}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {!item.imageUrl && item.status ? (
          <div className="mb-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${statusConfig.badge}`}
            >
              <CheckCircle2 size={12} className={statusConfig.icon} aria-hidden="true" />
              {item.status}
            </span>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#280f91]">
          <Award size={13} aria-hidden="true" />
          <span>{item.type}</span>
        </div>

        <h3 className="mt-1.5 text-base font-extrabold leading-snug text-[#0c0c0b]">
          {item.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#0c0c0b]/65">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export function TutorAchievements({ tutor }: TutorAchievementsProps) {
  const { achievements = [], university, major, experienceYears } = tutor;

  return (
    <SectionShell
      title="Học vấn & Thành tích"
      description="Thông tin học vấn, bằng cấp và các chứng chỉ chuyên môn đã được xác thực"
    >
      {/* 3-Column Structured Education Credentials */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {/* University Card */}
        <div className="flex items-start gap-3 rounded-xl border border-[#e8edf5] bg-[#f8faff] p-4 transition hover:border-[#280f91]/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#280f91]/10 text-[#280f91]">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#0c0c0b]/50">Trường đại học</span>
            <p className="mt-0.5 text-sm font-black leading-snug text-[#0c0c0b]">
              {university || "Đang cập nhật"}
            </p>
          </div>
        </div>

        {/* Major Card */}
        <div className="flex items-start gap-3 rounded-xl border border-[#e8edf5] bg-[#f8faff] p-4 transition hover:border-[#280f91]/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#447353]/10 text-[#447353]">
            <BookOpen size={19} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#0c0c0b]/50">Chuyên ngành</span>
            <p className="mt-0.5 text-sm font-black leading-snug text-[#0c0c0b]">
              {major || "Đang cập nhật"}
            </p>
          </div>
        </div>

        {/* Experience Card */}
        <div className="flex items-start gap-3 rounded-xl border border-[#e8edf5] bg-[#f8faff] p-4 transition hover:border-[#280f91]/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffc500]/20 text-[#905b0f]">
            <Briefcase size={19} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#0c0c0b]/50">Kinh nghiệm dạy</span>
            <p className="mt-0.5 text-sm font-black leading-snug text-[#0c0c0b]">
              {experienceYears || "Đang cập nhật"}
            </p>
          </div>
        </div>
      </div>

      {/* Achievement / Certificate Cards */}
      {achievements.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => (
            <AchievementCard key={`${item.title}-${index}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#e8edf5] p-6 text-center text-sm text-[#0c0c0b]/50">
          Chưa có chứng chỉ hoặc thành tích bổ sung nào được hiển thị.
        </div>
      )}
    </SectionShell>
  );
}

