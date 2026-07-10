"use client";

import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  MonitorIcon,
  HouseLineIcon,
  ArrowsHorizontalIcon,
  BookOpenIcon,
  UserIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import type { Tutor } from "../data/types";

interface TutorCardProps {
  tutor: Tutor;
  isLoggedIn?: boolean; // flexible for auth state later
  isBestMatch?: boolean;
}

const LEVEL_LABEL: Record<Tutor["level"], string> = {
  student: "Sinh viên",
  teacher: "Giáo viên",
  expert: "Chuyên gia",
};

const MODE_CONFIG: Record<
  Tutor["teachingMode"],
  { label: string; icon: typeof MonitorIcon }
> = {
  online: { label: "Online", icon: MonitorIcon },
  offline: { label: "Tại nhà", icon: HouseLineIcon },
  both: { label: "Online & Tại nhà", icon: ArrowsHorizontalIcon },
};

function StarRating({ value, count }: { value: number; count: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            size={13}
            className={
              i < full || (hasHalf && i === full)
                ? "text-accent"
                : "text-foreground/20"
            }
            aria-hidden="true"
          />
        ))}
      </div>
      <span
        className="text-xs font-bold text-foreground/80"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {value.toFixed(1)}
      </span>
      <span className="text-xs text-foreground/45">({count})</span>
    </div>
  );
}

export function TutorCard({
  tutor,
  isLoggedIn = false,
  isBestMatch = false,
}: TutorCardProps) {
  const modeConfig = MODE_CONFIG[tutor.teachingMode];
  const ModeIcon = modeConfig.icon;

  return (
    <article
      className={`group relative flex flex-col h-full rounded-2xl border bg-card overflow-hidden transition-all duration-250 hover:-translate-y-1 hover:shadow-xl ${
        isBestMatch
          ? "border-primary/40 shadow-lg shadow-primary/5 hover:border-primary/60 hover:shadow-primary/15"
          : "border-border hover:shadow-primary/10 hover:border-primary/20"
      }`}
      aria-label={`Gia sư ${tutor.name}`}
    >
      {isBestMatch && (
        <div
          className="absolute top-0 left-0 bg-linear-to-r from-primary to-blue-500 text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-br-xl z-20 flex items-center gap-1 shadow-sm"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <SparkleIcon size={12} weight="fill" /> Phù hợp nhất
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-border">
            <Image
              src={tutor.avatarUrl}
              alt={`Ảnh đại diện của ${tutor.name}`}
              fill
              className="object-cover"
              sizes="56px"
            />
            {tutor.availableNow && (
              <div
                className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-white"
                title="Đang nhận lớp"
                aria-label="Đang nhận lớp"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-sm font-extrabold text-foreground leading-snug line-clamp-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {tutor.name}
              </h3>
              {tutor.verification === "verified" && (
                <CheckCircleIcon
                  size={16}
                  weight="fill"
                  className="text-secondary dark:text-accent shrink-0 mt-0.5"
                  aria-label="Đã xác thực"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                <UserIcon size={11} aria-hidden="true" />
                {LEVEL_LABEL[tutor.level]}
              </span>
              <span className="text-foreground/25 text-xs">·</span>
              <span className="text-xs text-foreground/55">
                {tutor.experience} năm KN
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">
          {tutor.headline}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tutor.subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              <BookOpenIcon size={10} aria-hidden="true" />
              {subject}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-foreground/55 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <ModeIcon size={12} aria-hidden="true" />
            {modeConfig.label}
          </span>
          <span className="text-foreground/25">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPinIcon size={12} aria-hidden="true" />
            <span className="line-clamp-1">{tutor.location}</span>
          </span>
        </div>

        {tutor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tutor.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground/50 border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3.5">
        <div className="flex flex-col gap-0.5">
          <StarRating value={tutor.review.average} count={tutor.review.count} />
          <div className="flex items-baseline gap-1">
            <span
              className="text-sm font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {tutor.pricing.perSession.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-xs text-foreground/45">
              /{tutor.pricing.sessionDurationMin} phút
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <Link
            href={`/tutors/${tutor.id}`}
            id={`tutor-card-cta-${tutor.id}`}
            className="shrink-0 inline-flex h-8 items-center justify-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Xem hồ sơ
          </Link>
        ) : (
          <Link
            href={`/tutors/${tutor.id}`}
            id={`tutor-card-view-${tutor.id}`}
            className="shrink-0 inline-flex h-8 items-center justify-center rounded-full border border-primary px-4 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.98] whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Xem hồ sơ
          </Link>
        )}
      </div>
    </article>
  );
}
