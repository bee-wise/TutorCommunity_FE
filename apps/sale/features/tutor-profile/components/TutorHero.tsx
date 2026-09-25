import Image from "next/image";
import {
  BadgeCheck,
  GraduationCap,
  MapPin,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Zap,
} from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { InfoPill, RatingStars } from "./TutorProfilePrimitives";

interface TutorHeroProps {
  tutor: TutorProfileData;
}

const getLevelLabel = (studentYear: string) => {
  if (studentYear === "GRADUATED") return "Giáo viên / Chuyên gia";
  return "Sinh viên";
};

export function TutorHero({ tutor }: TutorHeroProps) {
  const avatarSrc =
    tutor.avatarUrl && !tutor.avatarUrl.includes("demo.invalid")
      ? tutor.avatarUrl
      : "/images/Tutor/1.png";

  const supportsHomeTeaching = tutor.teachingModes?.some((mode) =>
    mode.toLocaleLowerCase("vi").includes("tại nhà"),
  );

  const hourlyRateDisplay =
    typeof tutor.hourlyRate === "number"
      ? `${tutor.hourlyRate.toLocaleString("vi-VN")}đ`
      : tutor.hourlyRate;

  return (
    <section
      className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white shadow-[0_12px_40px_-16px_rgba(40,15,145,0.08)]"
      aria-label={`Hồ sơ gia sư ${tutor.displayName}`}
    >
      {/* Brand gradient accent top bar */}
      <div className="h-2 bg-gradient-to-r from-[#280f91] via-[#ffc500] to-[#447353]" />

      <div className="p-5 sm:p-7 lg:p-8">
        {/* Top: Avatar + Identity + Metadata */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Avatar Container */}
          <div className="flex flex-col items-center lg:shrink-0 gap-2.5">
            <a
              href={avatarSrc}
              target="_blank"
              rel="noreferrer"
              aria-label={`Xem ảnh gia sư ${tutor.displayName}`}
              className="group relative block"
            >
              <div className="relative h-36 w-36 overflow-hidden rounded-3xl border-2 border-[#e8edf5] bg-[#f5f8ff] shadow-lg shadow-[#280f91]/5 sm:h-44 sm:w-44 lg:h-48 lg:w-48 xl:h-52 xl:w-52">
                <Image
                  src={avatarSrc}
                  alt={`Ảnh gia sư ${tutor.displayName}`}
                  fill
                  priority
                  sizes="(min-width: 1280px) 208px, (min-width: 1024px) 192px, (min-width: 640px) 176px, 144px"
                  className="object-cover object-center transition duration-300 group-hover:scale-105"
                />
                <span
                  className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#447353] text-white shadow-md"
                  title="Đã xác thực danh tính & bằng cấp"
                >
                  <BadgeCheck size={16} aria-hidden="true" />
                </span>
              </div>
            </a>

            {/* Level Label below Avatar */}
            {tutor.studentYear ? (
              <span className="inline-flex items-center rounded-full border border-[#280f91]/20 bg-[#280f91]/8 px-3 py-1 text-xs font-bold text-[#280f91] shadow-xs">
                {getLevelLabel(tutor.studentYear)}
              </span>
            ) : null}
          </div>

          {/* Identity & Details */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            {/* Top Badges Row with Teaching Modes on top-right */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <InfoPill tone="success">
                  <BadgeCheck
                    size={13}
                    className="text-[#447353]"
                    aria-hidden="true"
                  />
                  Đã xác minh hồ sơ
                </InfoPill>
                {tutor.experienceYears ? (
                  <InfoPill tone="neutral">
                    Kinh nghiệm: {tutor.experienceYears}
                  </InfoPill>
                ) : null}
              </div>

              {/* Teaching Modes Badge on Top Right */}
              {tutor.teachingModes && tutor.teachingModes.length > 0 ? (
                <div className="inline-flex self-center sm:self-auto items-center gap-1.5 rounded-full border border-[#280f91]/25 bg-[#280f91]/8 px-3.5 py-2 text-xs font-bold text-[#280f91] shadow-xs">
                  <span>Hình thức: {tutor.teachingModes.join(", ")}</span>
                </div>
              ) : null}
            </div>

            {/* Tutor Name */}
            <h1 className="font-nunito mt-3 text-2xl font-black text-[#0c0c0b] sm:text-3xl lg:text-4xl">
              {tutor.displayName}
            </h1>

            {/* Headline */}
            <p className="mt-1.5 text-base font-bold text-[#280f91] sm:text-lg">
              {tutor.headline}
            </p>

            {/* Short Intro */}
            {tutor.shortIntro ? (
              <p className="mt-2 text-sm leading-relaxed text-[#0c0c0b]/70 sm:text-[15px]">
                {tutor.shortIntro}
              </p>
            ) : null}

            {/* Structured Info Rows (Vertical list) */}
            <div className="mt-4 flex flex-col gap-2 items-center sm:items-start">
              {/* Education Row */}
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e8edf5] bg-[#f8faff] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0c0c0b]/80 shadow-xs">
                <GraduationCap
                  size={16}
                  className="shrink-0 text-[#280f91]"
                  aria-hidden="true"
                />
                <span>
                  {tutor.major} · {tutor.university}
                </span>
              </div>

              {/* Area Row */}
              {supportsHomeTeaching && tutor.area ? (
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e8edf5] bg-[#f8faff] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0c0c0b]/80 shadow-xs">
                  <MapPin
                    size={16}
                    className="shrink-0 text-[#447353]"
                    aria-hidden="true"
                  />
                  <span>Khu vực dạy: {tutor.area}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Highlighted Stats KPI Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Card 1: Rating */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-gradient-to-b from-[#fffdf5] to-white p-3.5 text-center transition hover:border-[#ffc500]/50 hover:shadow-md sm:p-4 sm:text-left">
            <span className="text-xs font-semibold text-[#0c0c0b]/55">
              Đánh giá chung
            </span>
            <div className="mt-1.5 flex items-center justify-center gap-1.5 sm:justify-start">
              <span className="text-xl font-black text-[#0c0c0b] sm:text-2xl">
                {tutor.rating.toFixed(1)}
              </span>
              <RatingStars value={tutor.rating} size={14} />
            </div>
            <span className="mt-1 text-[11px] font-medium text-[#0c0c0b]/45">
              {tutor.reviewCount} lượt nhận xét
            </span>
          </div>

          {/* Card 2: Hours */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-gradient-to-b from-[#f8faff] to-white p-3.5 text-center transition hover:border-[#280f91]/30 hover:shadow-md sm:p-4 sm:text-left">
            <span className="text-xs font-semibold text-[#0c0c0b]/55">
              Thời gian dạy
            </span>
            <p className="mt-1.5 text-xl font-black text-[#280f91] sm:text-2xl">
              {tutor.teachingHours}
            </p>
            <span className="mt-1 text-[11px] font-medium text-[#0c0c0b]/45">
              Giờ giảng dạy tích lũy
            </span>
          </div>

          {/* Card 3: Hourly Rate */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-gradient-to-b from-[#f8faff] to-white p-3.5 text-center transition hover:border-[#280f91]/30 hover:shadow-md sm:p-4 sm:text-left">
            <span className="text-xs font-semibold text-[#0c0c0b]/55">
              Học phí từ
            </span>
            <p className="mt-1.5 text-xl font-black text-[#280f91] sm:text-2xl">
              {hourlyRateDisplay}
              <span className="text-xs font-semibold text-[#0c0c0b]/50">
                /h
              </span>
            </p>
            <span className="mt-1 text-[11px] font-medium text-[#0c0c0b]/45">
              Tùy cấp độ & môn học
            </span>
          </div>

          {/* Card 4: Response Time */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-gradient-to-b from-[#f6faf7] to-white p-3.5 text-center transition hover:border-[#447353]/30 hover:shadow-md sm:p-4 sm:text-left">
            <span className="text-xs font-semibold text-[#0c0c0b]/55">
              Phản hồi yêu cầu
            </span>
            <div className="mt-1.5 flex items-center justify-center gap-1 sm:justify-start">
              <Zap size={16} className="text-[#447353]" aria-hidden="true" />
              <p className="text-xl font-black text-[#447353] sm:text-2xl">
                {tutor.responseTime}
              </p>
            </div>
            <span className="mt-1 text-[11px] font-medium text-[#0c0c0b]/45">
              Tốc độ phản hồi trung bình
            </span>
          </div>
        </div>

        {/* Separated Subjects and Specializations Rows */}
        <div className="mt-6 space-y-4 border-t border-[#f0f4fa] pt-5">
          {/* Row 1: Subjects */}
          {tutor.subjects && tutor.subjects.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen
                  size={15}
                  className="text-[#280f91]"
                  aria-hidden="true"
                />
                <span className="text-xs font-black uppercase tracking-wider text-[#280f91]">
                  Môn học giảng dạy
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center rounded-xl border border-[#280f91]/25 bg-[#280f91]/8 px-3.5 py-1.5 text-xs font-bold text-[#280f91] transition hover:bg-[#280f91]/15"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Row 2: Specializations */}
          {tutor.specializations && tutor.specializations.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Award
                  size={15}
                  className="text-[#905b0f]"
                  aria-hidden="true"
                />
                <span className="text-xs font-black uppercase tracking-wider text-[#905b0f]">
                  Chuyên môn & Thế mạnh
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tutor.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center rounded-xl border border-[#ffc500]/70 bg-[#fff8e6] px-3.5 py-1.5 text-xs font-bold text-[#905b0f] transition hover:bg-[#fff0c2]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
