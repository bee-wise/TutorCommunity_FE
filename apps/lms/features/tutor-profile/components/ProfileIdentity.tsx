"use client";

import { useState } from "react";
import type { MeType } from "@workspace/core/types/auth.type";
import { getTutorPublicProfilePath } from "@workspace/core/constants/tutor-links";
import { actionClass, panelClass } from "@/components/lms-page-ui";
import type { TutorProfile } from "../types/profile.schemas";

function Avatar({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const allowed = url.startsWith("/") && !url.startsWith("//") || /^https:\/\//i.test(url);
  const initials = name.trim().split(/\s+/).slice(-2).map((word) => word[0]).join("").toUpperCase() || "GS";
  return allowed && !failed
    // Remote account media is not restricted to a fixed Next image host. Reserve dimensions and fall back on error.
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={url} alt={`Ảnh đại diện của ${name}`} width={88} height={88} referrerPolicy="no-referrer" onError={() => setFailed(true)} className="size-[88px] rounded-full border border-border object-cover" />
    : <span aria-label={`Ảnh đại diện chưa có của ${name}`} className="grid size-[88px] place-items-center rounded-full bg-primary font-nunito text-2xl font-extrabold text-primary-foreground">{initials}</span>;
}

export function ProfileIdentity({ profile, user }: { profile: TutorProfile; user: MeType }) {
  const name = profile.displayName || user.fullName || user.displayName || "Gia sư";
  return (
    <aside className={`${panelClass} space-y-5 lg:sticky lg:top-5`}>
      <Avatar key={profile.avatarUrl} url={profile.avatarUrl || user.avatarUrl || ""} name={name} />
      <div><h2 className="break-words font-nunito text-xl font-extrabold leading-relaxed text-primary">{name}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.headline || "Chưa có tiêu đề giới thiệu."}</p></div>
      <div className="flex flex-wrap gap-2">
        {user.isInterviewed === true && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold leading-5 text-secondary-foreground">Đã phỏng vấn</span>}
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold leading-5 text-primary">{user.isProfilePublic === true ? "Hồ sơ đang công khai" : user.isProfilePublic === false ? "Hồ sơ đang ẩn" : "Chưa rõ trạng thái hiển thị"}</span>
      </div>
      <dl className="space-y-4 border-t border-border pt-4 text-sm">
        <div><dt className="text-muted-foreground">Khu vực giảng dạy</dt><dd className="mt-1 font-bold leading-relaxed">{profile.area || "Chưa cập nhật"}</dd></div>
        <div><dt className="text-muted-foreground">Kinh nghiệm</dt><dd className="mt-1 font-bold">{profile.experienceYears || "Chưa cập nhật"}</dd></div>
        <div><dt className="text-muted-foreground">Nhận kết nối mới</dt><dd className="mt-1 font-bold">{user.canReceiveNewConnections === true ? "Đang nhận kết nối" : user.canReceiveNewConnections === false ? "Tạm ngừng nhận kết nối" : "Chưa có thông tin"}</dd></div>
      </dl>
      <a href={`https://beewise.vn${getTutorPublicProfilePath(user)}`} target="_blank" rel="noopener noreferrer" className={`${actionClass} w-full`}>Xem trên BeeWise ↗</a>
    </aside>
  );
}
