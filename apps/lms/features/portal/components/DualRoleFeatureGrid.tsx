import Image from "next/image";
import { BrowserFrame, SchedulePreview } from "./PortalProductVisuals";

const learnerBenefits = [
  {
    title: "Quản lý lịch học",
    body: "Theo dõi buổi học sắp tới và toàn bộ lịch trong tuần.",
  },
  {
    title: "Quản lý tài liệu",
    body: "Tài liệu được tải lên và bài tập tạo sinh từ AI giúp học viên học hiệu quả hơn.",
  },
  {
    title: "Theo dõi tiến độ học tập",
    body: "Biết được số buổi đã hoàn thành và những nội dung đang tiếp tục học.",
  },
] as const;

const tutorBenefits = [
  {
    title: "Quản lý nhiều học viên",
    body: "Quản lý thông tin, lịch học và tài liệu của tất cả học viên.",
  },
  {
    title: "Tạo bài tập và tóm tắt buổi học qua Beewise AI",
    body: "Tự động tạo bài tập và tóm tắt buổi học với sự hỗ trợ của AI",
  },
  {
    title: "Theo dõi tiến độ",
    body: "Tiến độ và học phí được quản lý và theo dõi dễ dàng",
  },
] as const;

function BenefitList({
  items,
}: {
  items: readonly { title: string; body: string }[];
}) {
  return (
    <div className="mt-9 space-y-7">
      {items.map((item, index) => (
        <div key={item.title} className="grid grid-cols-[32px_1fr] gap-4">
          <span className="pt-0.5 text-sm font-extrabold text-[#280f91]/45">
            0{index + 1}
          </span>
          <div>
            <h3
              className="text-lg font-extrabold text-primary"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              {item.title}
            </h3>
            <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#37333d]/65 sm:text-base">
              {item.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DualRoleFeatureGrid() {
  return (
    <section className="bg-[#fbfaf7] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-24">
          <p className="text-sm font-extrabold text-[#280f91]">
            LMS dành cho gia sư và học viên
          </p>
          <h2
            className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            <span className="text-accent">Beewise LMS</span> có gì nổi bật
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#37333d]/65">
            BeeWise LMS có đủ mọi thứ bạn cần để quản lý lớp học của mình.
          </p>
        </div>
        <div
          id="learner"
          className="grid scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16"
        >
          <SchedulePreview />
          <div>
            <p className="text-sm font-extrabold text-[#280f91]">
              Không gian học viên
            </p>
            <h2
              className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              Tính năng dành cho học viên
            </h2>
            <BenefitList items={learnerBenefits} />
          </div>
        </div>
        <div
          id="tutor"
          className="mt-24 grid scroll-mt-24 grid-cols-1 items-center gap-10 sm:mt-32 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16"
        >
          <div className="order-2 lg:order-1">
            <p className="text-sm font-extrabold text-[#280f91]">
              Không gian gia sư
            </p>
            <h2
              className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              Tính năng dành cho gia sư
            </h2>
            <BenefitList items={tutorBenefits} />
          </div>
          <BrowserFrame
            title="Quản lý lịch dạy"
            className="order-1 overflow-hidden rounded-[24px] border border-[#280f91]/12 bg-white shadow-[0_28px_80px_rgba(40,15,145,0.13)] lg:order-2"
          >
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1787298588/%E1%BA%A2nh_ch%E1%BB%A5p_m%C3%A0n_h%C3%ACnh_2026-08-21_145143.png"
              alt="Không gian gia sư"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
