import Image from "next/image";
import {
  ChalkboardTeacherIcon,
  HeadsetIcon,
  MagicWandIcon,
  WalletIcon,
} from "@phosphor-icons/react/dist/ssr";

const SUPPORT_ITEMS = [
  {
    icon: WalletIcon,
    title: "Thu nhập rõ ràng",
    text: "Mức học phí do bạn đưa ra, Beewise giúp bạn quản lý qua từng buổi học.",
  },
  {
    icon: HeadsetIcon,
    title: "Được hỗ trợ từ Beewise team",
    text: "Cố vấn hỗ trợ lịch học thử, trao đổi kỳ vọng và các vấn đề phát sinh.",
  },
  {
    icon: MagicWandIcon,
    title: "Bạn không có nhiều thời gian tóm tắt bài?",
    text: "Beewise sẽ giúp bạn tóm tắt buổi học và tạo sinh bài tập",
  },
];

export function TutorGuideFeatures() {
  return (
    <section
      className="bg-background py-20 sm:py-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <div>
            <h2
              id="features-heading"
              className="font-nunito uppercase font-black leading-[1.12] tracking-tight text-foreground"
            >
              <span className="block text-3xl sm:text-4xl">
                Một hồ sơ có chiều sâu,
              </span>
              <span className="mt-2 block text-2xl text-primary sm:text-[2rem]">
                không chỉ là vài dòng giới thiệu
              </span>
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-foreground/65">
              Môn dạy, kinh nghiệm, bằng cấp, lịch trống và phương pháp giảng
              dạy được trình bày trong cùng một hồ sơ để học viên hiểu rõ bạn
              trước khi kết nối.
            </p>
            <div className="relative mt-9 aspect-[16/10] overflow-hidden rounded-[2rem] bg-muted">
              <Image
                src="/brand/BeeWiseTeam.JPG"
                alt="Đội ngũ BeeWise xây dựng nền tảng dành cho gia sư"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:pt-18">
            <div className="rounded-[2rem] bg-accent p-7 text-accent-foreground sm:p-9">
              <ChalkboardTeacherIcon
                size={34}
                weight="duotone"
                aria-hidden="true"
              />
              <h3 className="mt-6 font-google-sans text-2xl font-bold leading-tight">
                Tập trung vào việc dạy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-accent-foreground/75">
                BeeWise lo phần kết nối, xác thực và vận hành để bạn dành nhiều
                thời gian hơn cho chất lượng buổi học.
              </p>
            </div>

            <div className="mt-8 grid gap-7">
              {SUPPORT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="grid grid-cols-[auto_1fr] gap-4 border-b border-border pb-7 last:border-b-0 last:pb-0"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Icon size={22} weight="duotone" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-google-sans text-lg font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
