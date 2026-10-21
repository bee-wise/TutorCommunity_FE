import Link from "next/link";
import { AlertCircle, Eye, Pencil, RefreshCw, UserX } from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import type { TutorProfileData } from "../types/tutor.type";
import { mockTutorProfile } from "../types/mockTutorProfile";
import { useTutorDetailQuery } from "../hooks/useTutorDetailQuery";
import { TutorAchievements } from "./TutorAchievements";
import { TutorBioSection } from "./TutorBioSection";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";

function TutorOwnProfileSummary({ tutor }: { tutor: TutorProfileData }) {
  const formattedRate =
    typeof tutor.hourlyRate === "number" && tutor.hourlyRate > 0
      ? `${tutor.hourlyRate.toLocaleString("vi-VN")}đ/giờ`
      : typeof tutor.hourlyRate === "string"
        ? tutor.hourlyRate
        : "Chưa cập nhật";

  const availability = tutor.availability ?? [];

  return (
    <aside className="rounded-2xl border border-[#e8edf5] bg-white p-5 shadow-sm lg:sticky lg:top-6 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#447353]">
          Trạng thái hồ sơ
        </p>
        <span className="inline-flex items-center rounded-full bg-[#447353]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#447353]">
          Đã xác thực
        </span>
      </div>
      <p className="mt-2 text-lg font-black text-[#17142f]">
        Đã xác thực bởi BeeWise
      </p>
      <p className="mt-1 text-sm leading-6 text-[#56516a]">
        Hồ sơ đang hiển thị và sẵn sàng nhận kết nối mới.
      </p>

      <div className="my-5 h-px bg-[#dce7f7]" />

      <p className="text-xs font-bold text-[#716c83]">Học phí công khai</p>
      <p className="mt-1 text-2xl font-black text-primary">{formattedRate}</p>

      <h2 className="mt-6 text-sm font-extrabold text-[#17142f]">
        Lịch có thể nhận lớp
      </h2>
      {availability.length > 0 ? (
        <div className="mt-3 grid gap-3">
          {availability.map((slot, index) => (
            <div
              key={`${slot.day}-${slot.time}-${index}`}
              className="rounded-xl bg-[#f7f9fd] px-3 py-3"
            >
              <p className="text-sm font-bold text-[#17142f]">{slot.day}</p>
              <p className="mt-0.5 text-xs text-[#56516a]">{slot.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#716c83]">
          Chưa thiết lập khung giờ nhận lớp.
        </p>
      )}
    </aside>
  );
}

function TutorOwnProfileSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-label="Đang tải hồ sơ..."
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-primary/10" />
          <div className="h-7 w-48 rounded-lg bg-[#e8edf5]" />
          <div className="h-4 w-72 rounded bg-[#e8edf5]" />
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-36 rounded-full bg-[#e8edf5]" />
          <div className="h-11 w-36 rounded-full bg-primary/20" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="h-28 w-28 shrink-0 rounded-2xl bg-[#e8edf5] sm:h-36 sm:w-36" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-52 rounded-lg bg-[#e8edf5]" />
            <div className="h-4 w-80 rounded bg-[#e8edf5]" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-24 rounded-full bg-[#e8edf5]" />
              <div className="h-6 w-28 rounded-full bg-[#e8edf5]" />
              <div className="h-6 w-20 rounded-full bg-[#e8edf5]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <div className="h-48 rounded-2xl border border-[#e8edf5] bg-white p-6" />
          <div className="h-48 rounded-2xl border border-[#e8edf5] bg-white p-6" />
          <div className="h-48 rounded-2xl border border-[#e8edf5] bg-white p-6" />
        </div>
        <div className="h-72 rounded-2xl border border-[#e8edf5] bg-white p-6" />
      </div>
    </div>
  );
}

function TutorOwnProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-nunito text-xl font-black text-[#17142f]">
        Không thể tải thông tin hồ sơ
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#56516a]">
        Đã có lỗi xảy ra trong quá trình tải hồ sơ gia sư từ hệ thống. Vui lòng
        thử lại.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={onRetry}
          className="h-10 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-[#200c76]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-[#dce7f7] bg-white px-5 text-sm font-bold text-[#17142f] hover:bg-[#f7f9fd]"
        >
          <Link href="/tutor/home">Trở về Trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

function TutorOwnProfileEmpty() {
  return (
    <div className="rounded-3xl border border-[#cfe1fa] bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f4fd] text-primary">
        <UserX className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-nunito text-xl font-black text-[#17142f]">
        Chưa tìm thấy hồ sơ gia sư
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#56516a]">
        Tài khoản của bạn chưa có hồ sơ gia sư hoàn thiện hoặc hồ sơ chưa được
        kích hoạt trên hệ thống.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="h-10 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-[#200c76]"
        >
          <Link href="/tutor/profile/edit">Cập nhật hồ sơ</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-[#dce7f7] bg-white px-5 text-sm font-bold text-[#17142f] hover:bg-[#f7f9fd]"
        >
          <Link href="/tutor/home">Về Trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

export function TutorOwnProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const isDevPreview = !user || user.id.startsWith("preview-");
  const tutorProfileId = user?.tutorProfileId || user?.id;

  const { data, isLoading, isError, refetch } = useTutorDetailQuery(
    tutorProfileId ?? "",
    { enabled: !isDevPreview && !!tutorProfileId },
  );

  const isProfileLoading =
    !isDevPreview && (isAuthLoading || (isLoading && !!tutorProfileId));

  if (isProfileLoading) {
    return <TutorOwnProfileSkeleton />;
  }

  if (!isDevPreview && isError) {
    return <TutorOwnProfileError onRetry={() => refetch()} />;
  }

  const tutorProfile = isDevPreview ? mockTutorProfile : data?.data;

  if (!tutorProfile) {
    return <TutorOwnProfileEmpty />;
  }

  const publicProfileHref = `/tutors/${encodeURIComponent(tutorProfile.id)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-bold text-primary">Hồ sơ gia sư</p>
          <h1 className="font-nunito mt-1 text-2xl font-black text-primary sm:text-3xl">
            Hồ sơ của tôi
          </h1>
          <p className="mt-1 text-sm leading-6 text-[#56516a]">
            Đây là nội dung đang được hiển thị với học viên trên BeeWise.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-full border-[#dce7f7] bg-white px-5 text-[#17142f] hover:bg-[#f7f9fd] sm:w-auto"
          >
            <Link href={publicProfileHref} target="_blank">
              <Eye size={17} aria-hidden="true" />
              Xem trang công khai
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 w-full rounded-full bg-primary px-5 text-white hover:bg-[#200c76] sm:w-auto"
          >
            <Link href="/tutor/profile/edit">
              <Pencil size={17} aria-hidden="true" />
              Chỉnh sửa hồ sơ
            </Link>
          </Button>
        </div>
      </div>

      <TutorHero tutor={tutorProfile} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <TutorBioSection tutor={tutorProfile} />
          <TutorTeachingMethods tutor={tutorProfile} />
          <TutorTeachingHistory tutor={tutorProfile} />
          <TutorAchievements tutor={tutorProfile} />
          <TutorIntroVideo videoUrl={tutorProfile.videoUrl} />
          <TutorFeedback tutor={tutorProfile} />
        </div>

        <TutorOwnProfileSummary tutor={tutorProfile} />
      </div>
    </div>
  );
}
