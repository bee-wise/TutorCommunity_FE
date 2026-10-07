"use client";

import { useState } from "react";
import { LmsPageSkeleton } from "@/components/LmsPageSkeleton";
import { actionClass, headingClass, pageClass, panelClass, primaryActionClass } from "@/components/lms-page-ui";
import { useOwnTutorProfile } from "../hooks/useOwnTutorProfile";
import { ProfileIdentity } from "./ProfileIdentity";
import { ProfileTeachingDetails } from "./ProfileTeachingDetails";
import { ProfileAccountDetails } from "./ProfileAccountDetails";

export function OwnProfileScreen() {
  const profile = useOwnTutorProfile();
  const [view, setView] = useState<"teaching" | "account">("teaching");
  if (profile.loading) return <LmsPageSkeleton profile />;
  return (
    <div className={pageClass}>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className={headingClass}>Hồ sơ của tôi</h1><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Thông tin giảng dạy và tài khoản gia sư của bạn trên BeeWise.</p></div>
        {profile.authorized && <a href="https://beewise.vn/tutor/profile/edit" target="_blank" rel="noopener noreferrer" className={`${primaryActionClass} self-start`}>Chỉnh sửa trên BeeWise ↗</a>}
      </header>
      {!profile.authorized || !profile.user ? <section className={panelClass}><p className="text-sm">Đăng nhập bằng tài khoản gia sư để xem hồ sơ của bạn.</p></section>
        : <>
          <div role="group" aria-label="Chọn nội dung hồ sơ" className="flex flex-wrap gap-2"><button type="button" aria-pressed={view === "teaching"} onClick={() => setView("teaching")} className={view === "teaching" ? primaryActionClass : actionClass}>Thông tin giảng dạy</button><button type="button" aria-pressed={view === "account"} onClick={() => setView("account")} className={view === "account" ? primaryActionClass : actionClass}>Tài khoản</button></div>
          {view === "account" ? <ProfileAccountDetails user={profile.user} />
            : profile.error ? <section role="alert" className={`${panelClass} space-y-4`}><h2 className="font-nunito text-lg font-extrabold text-primary">Chưa tải được hồ sơ gia sư</h2><p className="text-sm text-muted-foreground">Vui lòng kiểm tra kết nối mạng và thử lại. Thông tin tài khoản vẫn xem được ở mục Tài khoản.</p><button type="button" className={actionClass} disabled={profile.isFetching} onClick={() => void profile.refetch()}>{profile.isFetching ? "Đang tải…" : "Thử lại"}</button></section>
              : !profile.data ? <section className={`${panelClass} space-y-3`}><h2 className="font-nunito text-lg font-extrabold text-primary">Chưa có hồ sơ gia sư</h2><p className="text-sm leading-relaxed text-muted-foreground">Tài khoản chưa có mã hồ sơ. Hoàn thiện hồ sơ trên BeeWise hoặc liên hệ tư vấn viên để được kiểm tra.</p></section>
                : <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]"><ProfileIdentity profile={profile.data} user={profile.user} /><ProfileTeachingDetails profile={profile.data} /></div>}
        </>}
      {profile.authorized && <p className="text-xs leading-relaxed text-muted-foreground">Chỉnh sửa và xem bản công khai mở trên BeeWise ở tab mới. LMS không tự thay đổi trạng thái duyệt hoặc hiển thị hồ sơ.</p>}
    </div>
  );
}
