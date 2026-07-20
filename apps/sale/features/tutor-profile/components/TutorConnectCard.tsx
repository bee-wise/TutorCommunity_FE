import { CalendarClock, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";

interface TutorConnectCardProps {
  tutor: TutorProfileData;
  isSaved?: boolean;
  onConnect: () => void;
  onSave: () => void;
}

export function TutorConnectCard({
  tutor,
  isSaved = false,
  onConnect,
  onSave,
}: TutorConnectCardProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white shadow-[0_26px_76px_-34px_rgba(40,15,145,0.36)]">
        <div className="bg-[linear-gradient(135deg,#280f91_0%,#3213aa_62%,#447353_100%)] p-5 text-white sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fadc76]">
            Học phí
          </p>
          <p className="mt-2 text-3xl font-extrabold leading-none">
            {tutor.hourlyRate}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/76">
            Kết nối qua BeeWise để thống nhất lịch học và mục tiêu.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-2xl border border-[#cfe1fa] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#280f91] shadow-sm">
                <CalendarClock size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0c0c0b]">
                  Lịch rảnh dự kiến
                </p>
                <div className="mt-3 space-y-2">
                  {tutor.availability.map((slot) => (
                    <div
                      key={`${slot.day}-${slot.time}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 font-semibold text-[#280f91]">
                        {slot.day}
                      </span>
                      <span className="whitespace-nowrap text-right text-[#0c0c0b]/65">
                        {slot.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onConnect}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ffc500] px-5 py-4 text-sm font-extrabold text-[#0c0c0b] shadow-[0_18px_36px_-18px_rgba(144,91,15,0.95)] ring-1 ring-[#fadc76] transition hover:-translate-y-0.5 hover:bg-[#fadc76] hover:shadow-[0_22px_44px_-18px_rgba(144,91,15,1)] active:translate-y-0 active:scale-[0.99]"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Yêu cầu kết nối
            </button>
            <button
              type="button"
              onClick={onSave}
              className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
                isSaved
                  ? "border-[#447353] bg-[#447353] text-white hover:bg-[#3b6348]"
                  : "border-[#280f91]/18 bg-white text-[#280f91] hover:bg-[#280f91]/5"
              }`}
            >
              <Heart
                size={17}
                aria-hidden="true"
                className={isSaved ? "fill-current" : ""}
              />
              {isSaved ? "Đã lưu hồ sơ" : "Lưu hồ sơ"}
            </button>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#447353]/30 bg-[#447353]/10 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#447353] shadow-sm">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-[#0c0c0b]/70">
              Hồ sơ gia sư đã được xác thực bởi đội ngũ BeeWise.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
