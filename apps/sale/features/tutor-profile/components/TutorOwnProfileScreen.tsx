import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import { mockTutorProfile } from "../types/mockTutorProfile";
import { TutorAchievements } from "./TutorAchievements";
import { TutorBioSection } from "./TutorBioSection";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";

function TutorOwnProfileSummary() {
  return (
    <aside className="rounded-2xl border border-[#e8edf5] bg-white p-5 lg:sticky lg:top-6 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#447353]">
        Trạng thái hồ sơ
      </p>
      <p className="mt-2 text-lg font-black text-[#17142f]">Đã xác thực bởi BeeWise</p>
      <p className="mt-1 text-sm leading-6 text-[#56516a]">
        Hồ sơ đang hiển thị và sẵn sàng nhận kết nối mới.
      </p>

      <div className="my-5 h-px bg-[#dce7f7]" />

      <p className="text-xs font-bold text-[#716c83]">Học phí công khai</p>
      <p className="mt-1 text-2xl font-black text-[#280f91]">
        {typeof mockTutorProfile.hourlyRate === "number"
          ? `${mockTutorProfile.hourlyRate.toLocaleString("vi-VN")}đ/giờ`
          : mockTutorProfile.hourlyRate}
      </p>

      <h2 className="mt-6 text-sm font-extrabold text-[#17142f]">
        Lịch có thể nhận lớp
      </h2>
      <div className="mt-3 grid gap-3">
        {mockTutorProfile.availability.map((slot, index) => (
          <div
            key={`${slot.day}-${index}`}
            className="rounded-xl bg-[#f7f9fd] px-3 py-3"
          >
            <p className="text-sm font-bold text-[#17142f]">{slot.day}</p>
            <p className="mt-0.5 text-xs text-[#56516a]">{slot.time}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function TutorOwnProfileScreen() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-bold text-[#280f91]">Hồ sơ gia sư</p>
          <h1 className="font-nunito mt-1 text-2xl font-black text-[#17142f] sm:text-3xl">
            Hồ sơ của tôi
          </h1>
          <p className="mt-1 text-sm leading-6 text-[#56516a]">
            Đây là nội dung đang được hiển thị với học viên trên BeeWise.
          </p>
        </div>
        <Button
          asChild
          className="h-11 w-full rounded-full bg-[#280f91] px-5 text-white hover:bg-[#200c76] sm:w-auto"
        >
          <Link href="/tutor/profile/edit">
            <Pencil size={17} aria-hidden="true" />
            Chỉnh sửa hồ sơ
          </Link>
        </Button>
      </div>

      <TutorHero tutor={mockTutorProfile} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <TutorBioSection tutor={mockTutorProfile} />
          <TutorTeachingMethods tutor={mockTutorProfile} />
          <TutorTeachingHistory tutor={mockTutorProfile} />
          <TutorAchievements tutor={mockTutorProfile} />
          <TutorIntroVideo videoUrl={mockTutorProfile.videoUrl} />
          <TutorFeedback tutor={mockTutorProfile} />
        </div>

        <TutorOwnProfileSummary />
      </div>
    </div>
  );
}
