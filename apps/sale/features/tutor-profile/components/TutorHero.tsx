import Image from "next/image";
import {
  AcademicCapIcon,
  BoltIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { ImagePreview } from "@workspace/ui/components/ui/image-preview";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { InfoPill, RatingStars } from "./TutorProfilePrimitives";
import { useTutorViewsQuery } from "../hooks/useTutorViewsQuery";

interface TutorHeroProps {
  tutor: TutorProfileData;
  /** Owner-only actions (edit, view public page) pinned to the top-right of the hero. */
  actions?: React.ReactNode;
}

const getLevelLabel = (studentYear: string) => {
  if (studentYear === "GRADUATED") return "Giáo viên / Chuyên gia";
  return "Sinh viên";
};

function Fact({
  icon: Icon,
  children,
}: {
  icon: typeof BoltIcon;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-3.5 py-2 text-xs font-semibold text-foreground sm:text-sm">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
      {children}
    </li>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted px-4 py-3.5 [&:last-child:nth-child(odd)]:col-span-2 sm:[&:last-child:nth-child(odd)]:col-span-1">
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-black leading-tight tabular-nums text-foreground sm:text-xl">
        {children}
      </dd>
    </div>
  );
}

export function TutorHero({ tutor, actions }: TutorHeroProps) {
  const { data: viewsData } = useTutorViewsQuery(tutor.id);
  const totalViews = viewsData?.data?.totalViews;

  const avatarSrc =
    tutor.avatarUrl && !tutor.avatarUrl.includes("demo.invalid")
      ? tutor.avatarUrl
      : "/images/Tutor/1.png";

  const supportsHomeTeaching = tutor.teachingModes?.some((mode) =>
    mode.toLocaleLowerCase("vi").includes("tại nhà"),
  );
  const education = [tutor.major, tutor.university].filter(Boolean).join(" · ");
  const hasReviews = tutor.reviewCount > 0;

  const stats = [
    {
      label: "Đánh giá",
      value: hasReviews ? (
        <a
          href="#danh-gia"
          className="inline-flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {tutor.rating.toFixed(1)}
          <RatingStars value={tutor.rating} size={15} />
          <span className="text-xs font-semibold text-muted-foreground">
            ({tutor.reviewCount})
          </span>
        </a>
      ) : (
        <span className="text-base font-bold text-muted-foreground">
          Chưa có đánh giá
        </span>
      ),
    },
    tutor.teachingHours
      ? { label: "Đã giảng dạy", value: tutor.teachingHours }
      : null,
    tutor.experienceYears
      ? { label: "Kinh nghiệm", value: tutor.experienceYears }
      : null,
    tutor.responseTime
      ? {
          label: "Phản hồi yêu cầu",
          value: (
            <span className="inline-flex items-start gap-1.5 text-sm font-bold leading-snug">
              <BoltIcon
                className="mt-0.5 size-4 shrink-0 text-secondary"
                aria-hidden="true"
              />
              {tutor.responseTime}
            </span>
          ),
        }
      : null,
  ].filter((stat): stat is NonNullable<typeof stat> => stat !== null);

  return (
    <section
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
      aria-label={`Hồ sơ gia sư ${tutor.displayName}`}
    >
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7 lg:gap-9">
          <ImagePreview
            src={avatarSrc}
            alt={`Ảnh gia sư ${tutor.displayName}`}
            caption={tutor.displayName}
            triggerLabel={`Xem ảnh gia sư ${tutor.displayName}`}
            className="group shrink-0 self-start rounded-3xl"
          >
            <div className="relative size-32 overflow-hidden rounded-3xl border-2 border-border bg-muted shadow-soft sm:size-44 lg:size-56">
              <Image
                src={avatarSrc}
                alt={`Ảnh gia sư ${tutor.displayName}`}
                fill
                priority
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 176px, 128px"
                className="object-cover object-center transition duration-300 group-hover:scale-105"
              />
            </div>
          </ImagePreview>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <InfoPill tone="success" size="sm">
                <CheckBadgeIcon className="size-4" aria-hidden="true" />
                Đã xác minh bởi BeeWise
              </InfoPill>
              {tutor.studentYear ? (
                <InfoPill tone="primary" size="sm">
                  {getLevelLabel(tutor.studentYear)}
                </InfoPill>
              ) : null}
              {totalViews !== undefined ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <EyeIcon className="size-4" aria-hidden="true" />
                  {totalViews.toLocaleString("vi-VN")} lượt xem
                </span>
              ) : null}
            </div>
            {actions ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                {actions}
              </div>
            ) : null}
            </div>

            <h1 className="mt-3 font-nunito text-3xl font-black leading-[1.15] text-primary sm:text-4xl lg:text-[2.75rem]">
              {tutor.displayName}
            </h1>

            {tutor.headline ? (
              <p className="mt-2 text-base font-extrabold leading-snug text-foreground sm:text-xl">
                {tutor.headline}
              </p>
            ) : null}
            {tutor.shortIntro ? (
              <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {tutor.shortIntro}
              </p>
            ) : null}

            <ul className="mt-4 flex flex-wrap gap-2">
              {education ? (
                <Fact icon={AcademicCapIcon}>{education}</Fact>
              ) : null}
              {tutor.teachingModes?.length ? (
                <Fact icon={MapPinIcon}>
                  {tutor.teachingModes.join(", ")}
                  {supportsHomeTeaching && tutor.area
                    ? ` · ${tutor.area}`
                    : ""}
                </Fact>
              ) : null}
            </ul>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:[grid-template-columns:repeat(var(--stat-count),minmax(0,1fr))]"
          style={{ "--stat-count": stats.length } as React.CSSProperties}
        >
          {stats.map((stat) => (
            <Stat key={stat.label} label={stat.label}>
              {stat.value}
            </Stat>
          ))}
        </dl>
      </div>
    </section>
  );
}
