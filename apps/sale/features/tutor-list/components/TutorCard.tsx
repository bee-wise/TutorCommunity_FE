"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "@phosphor-icons/react";
import type { Tutor } from "../data/types";

interface TutorCardProps {
  tutor: Tutor;
  isLoggedIn?: boolean;
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

function TutorAvatar({ tutor }: { tutor: Tutor }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#dce3f0] bg-[#cfe1fa] sm:h-24 sm:w-24">
      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-[#280f91]" aria-label={`Ảnh dự phòng của ${tutor.name}`}>
          {tutor.name.split(" ").slice(-2).map((word) => word[0]).join("")}
        </div>
      ) : (
        <Image
          src={tutor.avatarUrl}
          alt={`Ảnh đại diện của gia sư ${tutor.name}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 80px, 96px"
          onError={() => setFailed(true)}
        />
      )}
      {tutor.availableNow && <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#447353]" aria-label="Đang nhận lớp" />}
    </div>
  );
}

export function TutorCard({ tutor, isLoggedIn = false, isBestMatch = false }: TutorCardProps) {
  const mode = MODE_CONFIG[tutor.teachingMode];
  const ModeIcon = mode.icon;
  const visibleSubjects = tutor.subjects.slice(0, 2);
  const visibleTags = tutor.tags.slice(0, 2);
  const extraCount = Math.max(0, tutor.subjects.length + tutor.tags.length - visibleSubjects.length - visibleTags.length);

  return (
    <article className="group flex h-full min-h-[430px] flex-col rounded-2xl border border-[#dce3f0] bg-white p-5 shadow-[0_6px_20px_rgba(16,24,40,0.045)] transition duration-200 hover:-translate-y-0.5 hover:border-[#280f91]/35 hover:shadow-[0_14px_30px_rgba(40,15,145,0.10)]" aria-label={`Gia sư ${tutor.name}`}>
      {isBestMatch && (
        <div className="mb-3 flex">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3cb] px-2.5 py-1 text-xs font-bold text-[#280f91]">
            <SparkleIcon size={13} weight="fill" aria-hidden="true" /> Phù hợp nhất
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <TutorAvatar tutor={tutor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-lg font-extrabold leading-tight text-[#0c0c0b]" style={{ fontFamily: "var(--font-montserrat)" }}>{tutor.name}</h3>
            {tutor.verification === "verified" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#447353]/10 px-2 py-0.5 text-[11px] font-bold text-[#447353]">
                <CheckCircleIcon size={13} weight="fill" aria-hidden="true" /> Đã xác thực
              </span>
            )}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[#667085]">
            <UserIcon size={14} className="text-[#280f91]" aria-hidden="true" />
            <span className="font-semibold text-[#344054]">{LEVEL_LABEL[tutor.level]}</span>
            <span aria-hidden="true">·</span>
            <span>{tutor.experience} năm kinh nghiệm</span>
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-11 text-sm leading-[1.55] text-[#475467]">{tutor.headline}</p>

      <div className="mt-4 flex min-h-14 flex-wrap content-start gap-2">
        {visibleSubjects.map((subject) => <span key={subject} className="rounded-full bg-[#eeeafe] px-2.5 py-1 text-xs font-bold text-[#280f91]">{subject}</span>)}
        {visibleTags.map((tag) => <span key={tag} className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-xs font-medium text-[#475467]">{tag}</span>)}
        {extraCount > 0 && <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-xs font-bold text-[#667085]">+{extraCount}</span>}
      </div>

      <div className="mt-3 space-y-2 text-[13px] text-[#667085]">
        <p className="flex items-center gap-2"><ModeIcon size={16} className="shrink-0 text-[#280f91]" aria-hidden="true" /><span>{mode.label}</span></p>
        <p className="flex items-center gap-2"><MapPinIcon size={16} className="shrink-0 text-[#280f91]" aria-hidden="true" /><span className="line-clamp-1">{tutor.location}</span></p>
        {tutor.availableNow && <p className="text-[#447353]">Rảnh buổi tối và cuối tuần</p>}
      </div>

      <div className="mt-auto border-t border-[#eaecf0] pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[13px]" aria-label={`${tutor.review.average} trên 5 sao, ${tutor.review.count} đánh giá`}>
              <StarIcon size={16} weight="fill" className="text-[#ffc510]" aria-hidden="true" />
              <strong className="text-[#0c0c0b]">{tutor.review.average.toFixed(1)}</strong>
              <span className="text-[#667085]">· {tutor.review.count} đánh giá</span>
            </p>
            <p className="mt-1 text-base font-extrabold text-[#0c0c0b]">
              {tutor.pricing.perSession.toLocaleString("vi-VN")} VNĐ
              <span className="text-xs font-medium text-[#667085]"> / {tutor.pricing.sessionDurationMin} phút</span>
            </p>
          </div>
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dce3f0] text-[#667085] hover:border-[#280f91] hover:text-[#280f91]" aria-label={`Lưu gia sư ${tutor.name}`}>
            <HeartIcon size={18} aria-hidden="true" />
          </button>
        </div>
        <Link href={`/tutors/${tutor.id}`} id={`${isLoggedIn ? "tutor-card-cta" : "tutor-card-view"}-${tutor.id}`} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#280f91] px-5 text-sm font-bold text-white transition hover:bg-[#1f0b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/40 sm:w-auto sm:self-end">
          Xem hồ sơ
        </Link>
      </div>
    </article>
  );
}
