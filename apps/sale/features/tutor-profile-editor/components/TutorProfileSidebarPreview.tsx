import type { TutorProfileData } from "../../tutor-profile/types/mockTutorProfile";

export function TutorProfileSidebarPreview({ tutor }: { tutor: TutorProfileData }) {
  return (
    <aside className="rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-[0_18px_48px_-30px_rgba(40,15,145,0.25)] lg:sticky lg:top-24 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#447353]">Thông tin nhận lớp</p>
      <p className="mt-2 text-2xl font-black text-[#280f91]">{tutor.hourlyRate}</p>
      <p className="mt-1 text-xs leading-5 text-[#716c83]">Mức học phí hiển thị công khai và cần được xét duyệt lại khi thay đổi.</p>
      <div className="my-5 h-px bg-[#dce7f7]" />
      <h2 className="text-sm font-extrabold text-[#17142f]">Lịch có thể nhận lớp</h2>
      <div className="mt-3 grid gap-3">
        {tutor.availability.map((slot, index) => (
          <div key={`${slot.day}-${index}`} className="rounded-xl bg-[#f7f9fd] px-3 py-3">
            <p className="text-sm font-bold text-[#17142f]">{slot.day}</p>
            <p className="mt-0.5 text-xs text-[#56516a]">{slot.time}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
