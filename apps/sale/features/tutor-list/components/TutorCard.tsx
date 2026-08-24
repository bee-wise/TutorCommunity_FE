"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowsHorizontalIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HeartIcon,
  HouseLineIcon,
  MapPinIcon,
  MonitorIcon,
  SparkleIcon,
  StarIcon,
  UserIcon,
  XIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import type { ApiTutorProfile } from "../data/types";
import { useFavoriteTutors } from "../../favorite-tutors/hooks/useFavoriteTutors";

interface TutorCardProps {
  tutor: ApiTutorProfile;
  isLoggedIn?: boolean;
  isBestMatch?: boolean;
}

const getLevelLabel = (studentYear: string) => {
  if (studentYear === "GRADUATED") return "Giáo viên / Chuyên gia";
  return "Sinh viên";
};

const getTeachingModeInfo = (modes: string[]) => {
  if (modes.includes("ONLINE") && modes.includes("OFFLINE"))
    return { label: "Online & Tại nhà", icon: ArrowsHorizontalIcon };
  if (modes.includes("ONLINE")) return { label: "Online", icon: MonitorIcon };
  return { label: "Tại nhà", icon: HouseLineIcon };
};

function TutorAvatar({ tutor }: { tutor: ApiTutorProfile }) {
  const [failed, setFailed] = useState(false);
  const name = tutor.displayName || "Gia Sư";
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#dce3f0] bg-[#cfe1fa] sm:h-24 sm:w-24">
      {failed || !tutor.avatarUrl ? (
        <div
          className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-[#280f91]"
          aria-label={`Ảnh dự phòng của ${name}`}
        >
          {name
            .split(" ")
            .slice(-2)
            .map((word) => word[0])
            .join("")}
        </div>
      ) : (
        <Image
          src={tutor.avatarUrl}
          alt={`Ảnh đại diện của gia sư ${name}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 80px, 96px"
          onError={() => setFailed(true)}
        />
      )}
      {tutor.isOnline && (
        <span
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#447353]"
          aria-label="Đang trực tuyến"
        />
      )}
    </div>
  );
}

export function TutorCard({
  tutor,
  isLoggedIn = false,
  isBestMatch = false,
}: TutorCardProps) {
  const [showReason, setShowReason] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoriteTutors();
  const tutorId = tutor.profileId || tutor.userId || "";
  const isSaved = isFavorite(tutorId);

  useEffect(() => {
    if (!showReason) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowReason(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showReason]);

  const handleSave = () => {
    if (!tutorId) return;
    toggleFavorite({
      tutorId,
      tutorName: tutor.displayName,
      isCurrentlySaved: isSaved,
    });
  };
  const modeInfo = getTeachingModeInfo(tutor.teachingModes || []);
  const ModeIcon = modeInfo.icon;
  const tags = [
    ...(tutor.subjects || []).map((subject) => subject?.name).filter(Boolean),
    ...(tutor.gradeLevels || [])
      .map((g) => (typeof g === "string" ? g : g?.name))
      .filter(Boolean),
    ...(tutor.specializations || [])
      .map((s) => (typeof s === "string" ? s : s?.name))
      .filter(Boolean),
  ];

  const visibleTags = tags.slice(0, 3);
  const extraCount = Math.max(0, tags.length - visibleTags.length);

  const location =
    tutor.offlineDistrict && tutor.offlineCity
      ? `${tutor.offlineDistrict}, ${tutor.offlineCity}`
      : tutor.offlineCity || "Online";

  const name = tutor.displayName || "Gia Sư";

  return (
    <>
      <article
        className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dce3f0] bg-white shadow-[0_4px_16px_rgba(16,24,40,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#280f91]/25 hover:shadow-[0_18px_38px_rgba(40,15,145,0.10)]"
        aria-label={`Gia sư ${name}`}
      >
        {isBestMatch && (
          <div className="h-1 w-full bg-[#ffc500]" aria-hidden="true" />
        )}

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-4 flex min-h-8 items-center justify-between gap-3">
            {isBestMatch ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6d6] px-2.5 py-1 text-[11px] font-extrabold text-[#8a5a00]"
                style={{ fontFamily: "var(--font-nunito-family)" }}
              >
                <SparkleIcon size={13} weight="fill" aria-hidden="true" />
                Phù hợp nhất
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#447353]">
                <CheckCircleIcon size={15} weight="fill" aria-hidden="true" />
                Hồ sơ đã xác thực
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${isSaved ? "border-[#f1b8c0] bg-[#fff1f3] text-[#c52f47]" : "border-[#dce3f0] bg-white text-[#667085] hover:border-[#280f91]/30 hover:bg-[#f7f5ff] hover:text-[#280f91]"}`}
              aria-label={`${isSaved ? "Bỏ lưu" : "Lưu"} gia sư ${name}`}
            >
              <HeartIcon
                size={17}
                weight={isSaved ? "fill" : "regular"}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <TutorAvatar tutor={tutor} />
            <div className="min-w-0 flex-1 pt-0.5">
              <h3
                className="line-clamp-2 text-lg font-extrabold leading-[1.25] text-[#17131f]"
                style={{ fontFamily: "var(--font-nunito-family)" }}
              >
                {name}
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475467]">
                <UserIcon
                  size={14}
                  className="shrink-0 text-[#280f91]"
                  aria-hidden="true"
                />
                <span className="line-clamp-1">
                  {getLevelLabel(tutor.studentYear)}
                </span>
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-[#667085]">
                {tutor.major || tutor.universityName}
              </p>
              <p
                className="mt-2 flex items-center gap-1.5 text-sm"
                aria-label={`${tutor.ratingAvg || 5} trên 5 sao`}
              >
                <StarIcon
                  size={16}
                  weight="fill"
                  className="text-[#e6a700]"
                  aria-hidden="true"
                />
                <strong className="text-[#17131f]">
                  {tutor.ratingAvg ? tutor.ratingAvg.toFixed(1) : "5.0"}
                </strong>
                <span className="text-xs text-[#98a2b3]">đánh giá</span>
              </p>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 min-h-11 text-sm leading-[1.55] text-[#475467]">
            {tutor.profileHeadline || tutor.bio || "Gia sư chuyên nghiệp"}
          </p>

          <div className="mt-3 flex min-h-7 flex-wrap content-start gap-1.5">
            {visibleTags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${index === 0 ? "bg-[#eeeaff] text-[#280f91]" : "border border-[#e2e7ef] bg-[#f8fafc] text-[#475467]"}`}
              >
                {tag}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-lg bg-[#f2f4f7] px-2.5 py-1 text-[11px] font-bold text-[#667085]">
                +{extraCount}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 rounded-xl border border-[#e7eaf2] bg-[#fafbfc] p-3 text-xs text-[#475467]">
            <p className="flex min-w-0 items-center gap-2">
              <ModeIcon
                size={16}
                className="shrink-0 text-[#280f91]"
                aria-hidden="true"
              />
              <span className="font-semibold">{modeInfo.label}</span>
            </p>
            <p className="flex min-w-0 items-start gap-2">
              <MapPinIcon
                size={16}
                className="mt-0.5 shrink-0 text-[#280f91]"
                aria-hidden="true"
              />
              <span className="min-w-0 break-words font-semibold leading-5">
                {location}
              </span>
            </p>
          </div>

          {tutor.reason && (
            <button
              type="button"
              onClick={() => setShowReason(true)}
              className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-[#f5f2ff] px-3.5 py-2.5 text-left text-xs font-bold text-[#280f91] transition hover:bg-[#eeeaff]"
            >
              <span className="flex items-center gap-2">
                <InfoIcon size={16} weight="fill" aria-hidden="true" />
                Vì sao gia sư này phù hợp?
              </span>
              <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
            </button>
          )}

          <div className="mt-auto flex items-end justify-between gap-4 pt-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">
                Học phí từ
              </p>
              <p
                className="mt-0.5 text-lg font-extrabold tracking-tight text-[#17131f]"
                style={{ fontFamily: "var(--font-nunito-family)" }}
              >
                {tutor.hourlyRate
                  ? tutor.hourlyRate.toLocaleString("vi-VN")
                  : "Liên hệ"}
                {tutor.hourlyRate ? (
                  <span className="ml-1 text-[11px] font-semibold tracking-normal text-[#667085]">
                    VNĐ / 60 phút
                  </span>
                ) : null}
              </p>
            </div>
            <Link
              href={`/tutors/${tutor.profileId}`}
              id={`${isLoggedIn ? "tutor-card-cta" : "tutor-card-view"}-${tutor.profileId}`}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#280f91] px-4 text-xs font-bold text-white shadow-[0_6px_16px_rgba(40,15,145,0.16)] transition hover:bg-[#1f0b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/40"
            >
              Xem hồ sơ
              <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showReason && (
              <div
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
                aria-modal="true"
                aria-labelledby={`reason-title-${tutor.profileId}`}
                aria-describedby={`reason-description-${tutor.profileId}`}
                role="dialog"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-[#09051b]/60 backdrop-blur-[3px]"
                  onClick={() => setShowReason(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex max-h-[min(760px,calc(100dvh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_32px_90px_rgba(9,5,27,0.32)]"
                >
                  <div className="flex items-start justify-between gap-5 border-b border-[#e7eaf2] bg-[#faf9ff] px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#280f91] text-white shadow-[0_8px_20px_rgba(40,15,145,0.2)]">
                        <SparkleIcon
                          size={21}
                          weight="fill"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#280f91]/65">
                          BeeWise AI phân tích
                        </p>
                        <h3
                          id={`reason-title-${tutor.profileId}`}
                          className="text-xl font-extrabold leading-tight text-[#17131f] sm:text-2xl"
                          style={{ fontFamily: "var(--font-nunito-family)" }}
                        >
                          Vì sao {name} phù hợp với bạn?
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReason(false)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dce3f0] bg-white text-[#667085] shadow-sm transition hover:border-[#280f91]/25 hover:bg-[#f5f2ff] hover:text-[#280f91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/30"
                      aria-label="Đóng cửa sổ lý do phù hợp"
                    >
                      <XIcon size={19} weight="bold" aria-hidden="true" />
                    </button>
                  </div>

                  <div
                    id={`reason-description-${tutor.profileId}`}
                    className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
                  >
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#dfe5f0] bg-[#f8fafc] px-4 py-3">
                      <CheckCircleIcon
                        size={20}
                        weight="fill"
                        className="shrink-0 text-[#447353]"
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-[#475467]">
                        Gợi ý này được đối chiếu từ nhu cầu của bạn với chuyên
                        môn và thông tin hồ sơ của gia sư.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {tutor.reason
                        ?.split(/(?=\d+\.\s)/)
                        .filter(Boolean)
                        .map((paragraph, index) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-xl border border-[#e7eaf2] p-4"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#280f91]/8 text-xs font-extrabold text-[#280f91]">
                              {index + 1}
                            </span>
                            <p className="pt-0.5 text-sm leading-6 text-[#344054]">
                              {paragraph.trim().replace(/^\d+\.\s*/, "")}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-[#e7eaf2] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                    <button
                      type="button"
                      onClick={() => setShowReason(false)}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dce3f0] px-5 text-sm font-bold text-[#475467] transition hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/25"
                    >
                      Đóng
                    </button>
                    <Link
                      href={`/tutors/${tutor.profileId}`}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#280f91] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(40,15,145,0.18)] transition hover:bg-[#1f0b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/35 focus-visible:ring-offset-2"
                    >
                      Xem hồ sơ {name}
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
