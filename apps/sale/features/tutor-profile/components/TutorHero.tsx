import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  GraduationCap,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TutorProfileData } from "../data/mockTutorProfile";
import { InfoPill } from "./TutorProfilePrimitives";

interface TutorHeroProps {
  tutor: TutorProfileData;
}

interface CompactInfoCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  tone?: "primary" | "secondary";
}

interface HeroStatCardProps {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone: "rating" | "primary" | "secondary";
}

const statToneClassName = {
  rating: {
    card: "border-[#ffc500]/35 bg-[#fff3cb]/45 text-[#0c0c0b]",
    icon: "bg-[#ffc500]/18 text-[#905b0f]",
  },
  primary: {
    card: "border-[#280f91]/15 bg-[#280f91]/7 text-[#280f91]",
    icon: "bg-white/70 text-[#280f91]",
  },
  secondary: {
    card: "border-[#447353]/20 bg-[#447353]/8 text-[#447353]",
    icon: "bg-white/70 text-[#447353]",
  },
};

function CompactInfoCard({
  icon: Icon,
  title,
  value,
  tone = "primary",
}: CompactInfoCardProps) {
  const iconClassName =
    tone === "secondary" ? "text-[#447353]" : "text-[#280f91]";

  return (
    <article className="w-full rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-sm">
      <div className="flex min-h-[72px] items-center gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#cfe1fa]/45">
          <Icon size={17} className={iconClassName} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-5 text-[#0c0c0b]">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-[#0c0c0b]/62">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function HeroStatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: HeroStatCardProps) {
  const toneClassName = statToneClassName[tone];

  return (
    <div
      className={`flex min-h-[82px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${toneClassName.card}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClassName.icon}`}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
          {label}
        </p>
        <p className="mt-1 text-base font-semibold leading-5">{value}</p>
        {detail ? (
          <p className="mt-0.5 text-xs leading-5 text-[#0c0c0b]/50">
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function TutorHero({ tutor }: TutorHeroProps) {
  const infoCards = [
    {
      icon: GraduationCap,
      title: tutor.studentYear,
      value: `${tutor.major}, ${tutor.university}`,
      tone: "primary" as const,
    },
    {
      icon: MapPin,
      title: "Khu vực dạy",
      value: tutor.area,
      tone: "secondary" as const,
    },
    {
      icon: Users,
      title: "Hình thức dạy",
      value: tutor.teachingModes.join(" và "),
      tone: "primary" as const,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#cfe1fa] bg-white shadow-[0_30px_80px_-42px_rgba(40,15,145,0.34)]">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:p-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-5">
          <div className="grid min-w-0 gap-5 sm:grid-cols-[136px_minmax(0,1fr)] sm:items-start lg:grid-cols-[152px_minmax(0,1fr)] lg:gap-6">
            <div className="flex justify-center sm:justify-start">
              <a
                href={tutor.avatarUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Xem ảnh gia sư ${tutor.displayName}`}
                className="group relative h-36 w-28 overflow-hidden rounded-[1.75rem] border-4 border-white bg-[#cfe1fa] shadow-2xl shadow-[#280f91]/14 outline-none transition hover:shadow-[#280f91]/20 focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2 sm:h-44 sm:w-36 lg:h-48 lg:w-40"
              >
                <Image
                  src={tutor.avatarUrl}
                  alt={`Ảnh đại diện của gia sư ${tutor.displayName}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 144px, 112px"
                  className="object-contain object-bottom p-2 transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#447353] text-white shadow-lg">
                  <BadgeCheck size={15} aria-hidden="true" />
                </span>
              </a>
            </div>

            <div className="min-w-0 pt-0 sm:pt-1 lg:pt-2">
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <InfoPill icon={BadgeCheck} tone="success">
                  Gia sư đã xác thực
                </InfoPill>
              </div>

              <h1 className="mt-3 text-center text-3xl font-extrabold leading-tight text-[#0c0c0b] sm:text-left sm:text-4xl xl:text-[44px]">
                {tutor.displayName}
              </h1>
              <p className="mt-2 max-w-3xl text-center text-base font-bold leading-7 text-[#280f91] sm:text-left sm:text-lg">
                {tutor.headline}
              </p>
              <p className="mt-2 max-w-2xl text-center text-sm leading-7 text-[#0c0c0b]/65 sm:text-left sm:text-[15px]">
                {tutor.shortIntro}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <HeroStatCard
              label="Đánh giá"
              value={`${tutor.rating.toFixed(1)}/5.0`}
              detail={`${tutor.reviewCount} đánh giá`}
              icon={Star}
              tone="rating"
            />
            <HeroStatCard
              label="Phản hồi"
              value={tutor.responseTime}
              icon={Clock3}
              tone="primary"
            />
            <HeroStatCard
              label="Giờ dạy"
              value={tutor.teachingHours}
              icon={BookOpen}
              tone="secondary"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {tutor.subjects.map((subject) => (
              <span
                key={subject}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#280f91]/15 bg-[#280f91]/8 px-3 py-2 text-center text-xs font-semibold text-[#280f91] shadow-sm"
              >
                <BookOpen size={14} aria-hidden="true" />
                {subject}
              </span>
            ))}
            {tutor.specializations.map((specialization) => (
              <span
                key={specialization}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#ffc500]/45 bg-[#fff3cb] px-3 py-2 text-center text-xs font-semibold text-[#905b0f] shadow-sm"
              >
                <Star size={14} aria-hidden="true" />
                {specialization}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-[#cfe1fa] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="grid h-full gap-3 rounded-3xl bg-[#cfe1fa]/18 p-4 sm:grid-cols-3 lg:grid-cols-1">
            {infoCards.map((card) => (
              <CompactInfoCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                tone={card.tone}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
