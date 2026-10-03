import Image from "next/image";
import {
  BadgeCheck,
  GraduationCap,
  MapPin,
  BookOpen,
  Award,
  Zap,
  Eye,
  Clock,
} from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { InfoPill, RatingStars } from "./TutorProfilePrimitives";
import { useTutorViewsQuery } from "../hooks/useTutorViewsQuery";

interface TutorHeroProps {
  tutor: TutorProfileData;
}

const getLevelLabel = (studentYear: string) => {
  if (studentYear === "GRADUATED") return "Giáo viên / Chuyên gia";
  return "Sinh viên";
};

export function TutorHero({ tutor }: TutorHeroProps) {
  const { data: viewsData, isLoading: isViewsLoading } = useTutorViewsQuery(
    tutor.id,
  );
  const totalViews = viewsData?.data?.totalViews;

  const avatarSrc =
    tutor.avatarUrl && !tutor.avatarUrl.includes("demo.invalid")
      ? tutor.avatarUrl
      : "/images/Tutor/1.png";

  const supportsHomeTeaching = tutor.teachingModes?.some((mode) =>
    mode.toLocaleLowerCase("vi").includes("tại nhà"),
  );

  const offeringMinPrice =
    tutor.teachingOfferings && tutor.teachingOfferings.length > 0
      ? Math.min(
          ...tutor.teachingOfferings
            .map((o) => o.basePrice)
            .filter((p): p is number => typeof p === "number" && p > 0),
        )
      : null;

  const effectiveHourlyRate =
    typeof tutor.hourlyRate === "number" && tutor.hourlyRate > 0
      ? tutor.hourlyRate
      : offeringMinPrice && Number.isFinite(offeringMinPrice)
        ? offeringMinPrice
        : null;

  const hourlyRateDisplay =
    typeof effectiveHourlyRate === "number"
      ? `${effectiveHourlyRate.toLocaleString("vi-VN")}đ`
      : typeof tutor.hourlyRate === "string"
        ? tutor.hourlyRate
        : "-";

  const offerings = tutor.teachingOfferings || [];

  return (
    <section
      className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white shadow-[0_12px_40px_-16px_rgba(40,15,145,0.08)]"
      aria-label={`Hồ sơ gia sư ${tutor.displayName}`}
    >
      {/* Brand gradient accent top bar */}
      <div className="h-2 bg-gradient-to-r from-[#280f91] via-[#ffc500] to-[#447353]" />

      <div className="p-5 sm:p-7 lg:p-8">
        {/* ── Row layout: avatar left, info right ── */}
        <div className="flex items-start gap-4 sm:gap-6 lg:gap-8">
          {/* ── Avatar column — always on the left ── */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <a
              href={avatarSrc}
              target="_blank"
              rel="noreferrer"
              aria-label={`Xem ảnh gia sư ${tutor.displayName}`}
              className="group relative block"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#e8edf5] bg-[#f5f8ff] shadow-lg shadow-[#280f91]/5 sm:h-36 sm:w-36 sm:rounded-3xl lg:h-48 lg:w-48 xl:h-52 xl:w-52">
                <Image
                  src={avatarSrc}
                  alt={`Ảnh gia sư ${tutor.displayName}`}
                  fill
                  priority
                  sizes="(min-width: 1280px) 208px, (min-width: 1024px) 192px, (min-width: 640px) 144px, 96px"
                  className="object-cover object-center transition duration-300 group-hover:scale-105"
                />
                <span
                  className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#447353] text-white shadow-md sm:bottom-2.5 sm:right-2.5 sm:h-8 sm:w-8"
                  title="Đã xác thực danh tính & bằng cấp"
                >
                  <BadgeCheck
                    size={13}
                    className="sm:hidden"
                    aria-hidden="true"
                  />
                  <BadgeCheck
                    size={16}
                    className="hidden sm:block"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>

            {/* Level label — below avatar */}
            {tutor.studentYear ? (
              <span className="inline-flex items-center rounded-full border border-primary bg-card px-2 py-0.5 text-[10px] font-bold text-primary sm:px-3 sm:py-1 sm:text-xs">
                {getLevelLabel(tutor.studentYear)}
              </span>
            ) : null}
          </div>

          {/* ── Right column: top bar (views + teaching mode) + name with badge + headline ── */}
          <div className="min-w-0 flex-1">
            {/* Top row: Views on left, Teaching mode on the right */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                {isViewsLoading ? (
                  <div className="h-6 w-20 animate-pulse rounded-full bg-[#f0f4fa]" />
                ) : totalViews !== undefined ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <Eye
                      size={12}
                      className="text-[#280f91]"
                      aria-hidden="true"
                    />
                    {totalViews.toLocaleString("vi-VN")} lượt xem
                  </span>
                ) : null}
              </div>

              {/* Teaching mode badge on the right */}
              {tutor.teachingModes && tutor.teachingModes.length > 0 ? (
                <span className="inline-flex items-center rounded-full border border-primary bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground sm:px-3.5 sm:py-1.5 sm:text-xs">
                  Hình thức: {tutor.teachingModes.join(", ")}
                </span>
              ) : null}
            </div>

            {/* Name + Verified badge side-by-side */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-3">
              <h1 className="font-nunito text-xl font-black leading-tight text-[#0c0c0b] sm:text-3xl lg:text-4xl">
                {tutor.displayName}
              </h1>
              <InfoPill tone="success" size="sm">
                <BadgeCheck
                  size={12}
                  className="text-secondary"
                  aria-hidden="true"
                />
                Đã xác minh
              </InfoPill>
            </div>

            {/* Headline */}
            <p className="mt-1 text-sm font-bold text-[#280f91] sm:mt-1.5 sm:text-lg">
              {tutor.headline}
            </p>

            {/* Short intro — desktop only in top box */}
            {tutor.shortIntro ? (
              <p className="mt-2 hidden text-sm leading-relaxed text-[#0c0c0b]/70 sm:block sm:text-[15px]">
                {tutor.shortIntro}
              </p>
            ) : null}
          </div>
        </div>

        {/* Short intro on mobile — shown below the row */}
        {tutor.shortIntro ? (
          <p className="mt-3 text-sm leading-relaxed text-[#0c0c0b]/70 sm:hidden">
            {tutor.shortIntro}
          </p>
        ) : null}

        {/* ── Education & area ── */}
        <div className="mt-4 flex flex-col items-start gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e8edf5] bg-[#f8faff] px-3.5 py-2 text-xs font-semibold text-[#0c0c0b]/80 shadow-xs sm:text-sm">
            <GraduationCap
              size={16}
              className="shrink-0 text-[#280f91]"
              aria-hidden="true"
            />
            <span>
              {tutor.major} · {tutor.university}
            </span>
          </div>

          {supportsHomeTeaching && tutor.area ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e8edf5] bg-[#f8faff] px-3.5 py-2 text-xs font-semibold text-[#0c0c0b]/80 shadow-xs sm:text-sm">
              <MapPin
                size={16}
                className="shrink-0 text-[#447353]"
                aria-hidden="true"
              />
              <span>Khu vực dạy: {tutor.area}</span>
            </div>
          ) : null}
        </div>

        {/* ── KPI Stats grid ── */}
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

          {/* Card 2: Teaching Hours */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-gradient-to-b from-[#f8faff] to-white p-3.5 text-center transition hover:border-[#280f91]/30 hover:shadow-md sm:p-4 sm:text-left">
            <span className="text-xs font-semibold text-[#0c0c0b]/55">
              Thời gian dạy
            </span>
            <p className="mt-1.5 text-xl font-black text-[#280f91] sm:text-2xl">
              {tutor.teachingHours ? tutor.teachingHours : "0"}
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
              <p className="text-xl font-black text-[#447353] sm:text-[14px]">
                {tutor.responseTime ? tutor.responseTime : "-"}
              </p>
            </div>
            <span className="mt-1 text-[11px] font-medium text-[#0c0c0b]/45">
              Tốc độ phản hồi trung bình
            </span>
          </div>
        </div>

        {/* ── Experience, Subjects & Specializations ── */}
        <div className="mt-6 space-y-4 border-t border-[#f0f4fa] pt-5">
          {/* Row 0: Experience (KN) */}
          {tutor.experienceYears ? (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Clock
                  size={15}
                  className="text-[#280f91]"
                  aria-hidden="true"
                />
                <span className="text-xs font-black uppercase tracking-wider text-[#280f91]">
                  Kinh nghiệm giảng dạy
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-xs font-bold text-primary">
                  {tutor.experienceYears} kinh nghiệm
                </span>
              </div>
            </div>
          ) : null}

          {/* Row 1: Teaching Offerings (tutorOffering) */}
          {offerings && offerings.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen
                  size={15}
                  className="text-[#280f91]"
                  aria-hidden="true"
                />
                <span className="text-xs font-black uppercase tracking-wider text-[#280f91]">
                  Tổ hợp giảng dạy
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {offerings.map((offering, idx) => {
                  const item =
                    offering.teachingItemName ||
                    offering.proposal?.teachingItemName ||
                    offering.programName;
                  const context =
                    offering.contextName || offering.proposal?.contextName;
                  const label =
                    item && context
                      ? `${item} · ${context}`
                      : item || context || "Nội dung dạy";

                  return (
                    <span
                      key={offering.id || `${label}-${idx}`}
                      className="inline-flex items-center rounded-xl border border-primary bg-card px-3.5 py-1.5 text-xs font-bold text-primary"
                    >
                      {label}
                    </span>
                  );
                })}
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
