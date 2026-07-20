"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowsHorizontalIcon,
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
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem("savedTutors") || "[]"
      );
      if (saved.includes(tutor.profileId || tutor.userId || "")) {
        setIsSaved(true);
      }
    } catch (e) {}
  }, [tutor.profileId, tutor.userId]);

  const handleSave = () => {
    try {
      const id = tutor.profileId || tutor.userId || "";
      if (!id) return;
      const saved: string[] = JSON.parse(
        localStorage.getItem("savedTutors") || "[]"
      );
      if (isSaved) {
        const newSaved = saved.filter((tutorId) => tutorId !== id);
        localStorage.setItem("savedTutors", JSON.stringify(newSaved));
        setIsSaved(false);
      } else {
        if (!saved.includes(id)) {
          saved.push(id);
          localStorage.setItem("savedTutors", JSON.stringify(saved));
        }
        setIsSaved(true);
      }
    } catch (e) {}
  };
  const modeInfo = getTeachingModeInfo(tutor.teachingModes || []);
  const ModeIcon = modeInfo.icon;
  const tags = [
    ...(tutor.gradeLevels || []).map((g) => typeof g === "string" ? g : g?.name).filter(Boolean),
    ...(tutor.specializations || []).map((s) => typeof s === "string" ? s : s?.name).filter(Boolean),
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
        className="group flex h-full flex-col rounded-2xl border border-[#dce3f0] bg-white p-4 shadow-sm transition duration-250 hover:-translate-y-1 hover:border-[#280f91]/30 hover:shadow-[0_12px_24px_rgba(40,15,145,0.08)]"
        aria-label={`Gia sư ${name}`}
      >
        {(isBestMatch || tutor.reason) && (
          <div className={`mb-3 flex items-center ${isBestMatch ? 'justify-between' : 'justify-end'}`}>
            {isBestMatch && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#ffc500]/15 px-2.5 py-1 text-xs font-bold text-[#905b0f]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <SparkleIcon size={13} weight="fill" aria-hidden="true" /> Phù hợp nhất
              </span>
            )}
            {tutor.reason && (
              <button
                type="button"
                onClick={() => setShowReason(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#280f91] hover:underline"
              >
                <InfoIcon size={14} weight="bold" /> Lý do lựa chọn
              </button>
            )}
          </div>
        )}

        <div className="flex items-start gap-4">
          <TutorAvatar tutor={tutor} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3
                className="text-lg font-extrabold leading-tight text-[#0c0c0b]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e6efe9] px-2 py-0.5 text-[11px] font-bold text-[#447353]">
                <CheckCircleIcon size={13} weight="fill" aria-hidden="true" />{" "}
                Đã xác thực
              </span>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[#667085]">
              <UserIcon
                size={14}
                className="text-[#280f91]"
                aria-hidden="true"
              />
              <span className="font-semibold text-[#344054]">
                {getLevelLabel(tutor.studentYear)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="line-clamp-1">{tutor.major}</span>
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-11 text-sm leading-[1.55] text-[#475467]">
          {tutor.profileHeadline || tutor.bio || "Gia sư chuyên nghiệp"}
        </p>

        <div className="mt-4 flex min-h-8 flex-wrap content-start gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f8fafc] border border-[#dce3f0] px-2.5 py-1 text-xs font-semibold text-[#475467]"
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-xs font-bold text-[#667085]">
              +{extraCount}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2 text-[13px] text-[#667085]">
          <p className="flex items-center gap-2">
            <ModeIcon
              size={16}
              className="shrink-0 text-[#280f91]"
              aria-hidden="true"
            />
            <span>{modeInfo.label}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPinIcon
              size={16}
              className="shrink-0 text-[#280f91]"
              aria-hidden="true"
            />
            <span className="line-clamp-1">{location}</span>
          </p>
          {tutor.isOnline && (
            <p className="text-[#447353]">Rảnh buổi tối và cuối tuần</p>
          )}
        </div>

        <div className="mt-auto border-t border-[#eaecf0] pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p
                className="flex items-center gap-1.5 text-[13px]"
                aria-label={`${tutor.ratingAvg} trên 5 sao`}
              >
                <StarIcon
                  size={16}
                  weight="fill"
                  className="text-[#ffc510]"
                  aria-hidden="true"
                />
                <strong className="text-[#0c0c0b]">
                  {tutor.ratingAvg ? tutor.ratingAvg.toFixed(1) : "5.0"}
                </strong>
              </p>
              <p className="mt-1 text-base font-extrabold text-[#0c0c0b]">
                {tutor.hourlyRate
                  ? tutor.hourlyRate.toLocaleString("vi-VN")
                  : "0"}{" "}
                VNĐ
                <span className="text-xs font-medium text-[#667085]">
                  {" "}
                  / 60 phút
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                isSaved
                  ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                  : "border-[#dce3f0] text-[#667085] hover:border-[#280f91] hover:text-[#280f91]"
              }`}
              aria-label={`${isSaved ? "Bỏ lưu" : "Lưu"} gia sư ${name}`}
            >
              <HeartIcon
                size={18}
                weight={isSaved ? "fill" : "regular"}
                aria-hidden="true"
              />
            </button>
          </div>
          <Link
            href={`/tutors/${tutor.profileId}`}
            id={`${isLoggedIn ? "tutor-card-cta" : "tutor-card-view"}-${tutor.profileId}`}
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#280f91] px-5 text-sm font-bold text-white transition hover:bg-[#1f0b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/40 sm:w-auto sm:self-end"
          >
            Xem hồ sơ
          </Link>
        </div>
      </article>

      <AnimatePresence>
        {showReason && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowReason(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 p-6 shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-start justify-between border-b border-[#dce3f0]/50 pb-3 mb-4">
                <h3
                  className="text-lg font-extrabold text-[#0c0c0b] flex items-center gap-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <SparkleIcon
                    size={20}
                    className="text-[#280f91]"
                    weight="fill"
                  />
                  Lý do phù hợp
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReason(false)}
                  className="rounded-full p-1 text-[#667085] hover:bg-black/5 transition-colors"
                  aria-label="Đóng"
                >
                  <XIcon size={18} weight="bold" />
                </button>
              </div>
              <div className="text-sm leading-relaxed text-[#344054] space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {tutor.reason?.split(/(?=\d+\.\s)/).map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReason(false)}
                  className="rounded-xl border border-[#dce3f0] px-5 py-2 text-sm font-bold text-[#475467] hover:bg-[#f8fafc] transition-colors"
                >
                  Đóng
                </button>
                <Link
                  href={`/tutors/${tutor.profileId}`}
                  className="rounded-xl bg-[#280f91] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1f0b70]"
                >
                  Xem hồ sơ
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
