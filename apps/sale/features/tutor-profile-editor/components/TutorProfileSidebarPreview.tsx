import Link from "next/link";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import type { TutorProfileData } from "../../tutor-profile/types/mockTutorProfile";

export function TutorProfileSidebarPreview({
  tutor,
  onEdit,
}: {
  tutor: TutorProfileData;
  onEdit: () => void;
}) {
  return (
    <aside className="relative rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-[0_18px_48px_-30px_rgba(40,15,145,0.25)] lg:sticky lg:top-24 sm:p-6">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Chỉnh sửa môn dạy, học phí và khu vực"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-md transition hover:-translate-y-0.5 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <PencilSimpleIcon size={18} weight="bold" aria-hidden="true" />
      </button>
      <p className="pr-12 text-xs font-bold uppercase tracking-[0.16em] text-[#447353]">
        Thông tin nhận lớp
      </p>
      <p className="mt-2 text-2xl font-black text-primary">
        {tutor.hourlyRate > 0
          ? `Từ ${tutor.hourlyRate.toLocaleString("vi-VN")}đ/giờ`
          : "Chưa có học phí"}
      </p>
      <p className="mt-1 text-xs leading-5 text-[#716c83]">
        Mức học phí hiển thị công khai và cần được xét duyệt lại khi thay đổi.
      </p>
      {tutor.area ? (
        <p className="mt-3 text-sm font-semibold text-[#17142f]">
          Khu vực: <span className="font-normal text-[#56516a]">{tutor.area}</span>
        </p>
      ) : null}
      <div className="my-5 h-px bg-[#dce7f7]" />
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-[#17142f]">
          Lịch có thể nhận lớp
        </h2>
        <Link
          href="/tutor/availability"
          className="text-xs font-bold text-primary hover:underline"
        >
          Quản lý lịch
        </Link>
      </div>
      <div className="mt-3 grid gap-3">
        {tutor.availability.length === 0 ? (
          <p className="rounded-xl bg-[#f7f9fd] px-3 py-3 text-xs text-[#56516a]">
            Chưa có lịch rảnh. Lịch được quản lý riêng tại trang lịch rảnh.
          </p>
        ) : (
          tutor.availability.map((slot, index) => (
            <div
              key={`${slot.day}-${index}`}
              className="rounded-xl bg-[#f7f9fd] px-3 py-3"
            >
              <p className="text-sm font-bold text-[#17142f]">{slot.day}</p>
              <p className="mt-0.5 text-xs text-[#56516a]">{slot.time}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
