import Image from "next/image";
import {
  HeadsetIcon,
  MagicWandIcon,
  WalletIcon,
} from "@phosphor-icons/react/dist/ssr";

const SUPPORT_ITEMS = [
  {
    icon: WalletIcon,
    title: "Thu nhập rõ ràng",
    text: "Bạn chủ động đề xuất học phí. BeeWise ghi nhận và quản lý thu nhập theo từng buổi.",
  },
  {
    icon: HeadsetIcon,
    title: "Hỗ trợ khi cần",
    text: "Cố vấn đồng hành trong buổi học thử, thống nhất kỳ vọng và xử lý tình huống phát sinh.",
  },
  {
    icon: MagicWandIcon,
    title: "Nhẹ việc sau buổi học",
    text: "BeeWise hỗ trợ tạo tóm tắt và bài tập để bạn có thêm thời gian chuẩn bị buổi tiếp theo.",
  },
];

export function TutorGuideFeatures() {
  return (
    <section
      className="relative overflow-hidden bg-background py-20 sm:py-28"
      aria-labelledby="features-heading"
    >
      <div
        className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-accent/12"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2
            id="features-heading"
            className="font-google-sans text-3xl font-black leading-[1.08] tracking-[-0.025em] text-primary sm:text-4xl lg:text-5xl"
          >
            Một hồ sơ có chiều sâu,
            <span className="mt-1 block text-accent">
              không chỉ là vài dòng giới thiệu
            </span>
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-7 text-foreground/65 sm:text-lg">
            Môn dạy, kinh nghiệm, bằng cấp, lịch trống và phương pháp được trình
            bày rõ ràng để học viên hiểu bạn trước khi quyết định kết nối.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 lg:items-center">
          <figure className="min-w-0 lg:col-start-1 lg:col-end-9 lg:row-start-1">
            <div className="rounded-[2rem] border border-primary/10 bg-white p-3 shadow-[0_24px_70px_rgba(40,15,145,0.12)] sm:rounded-[2.5rem] sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-muted sm:aspect-[16/10] sm:rounded-[2rem]">
                <Image
                  src="/brand/BeeWiseTeam-2.JPG"
                  alt="Đội ngũ BeeWise đồng hành cùng cộng đồng gia sư"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <figcaption className="mt-4 max-w-[58ch] border-l-4 border-accent pl-4 text-sm leading-6 text-foreground/62">
              Đội ngũ BeeWise hỗ trợ gia sư từ lúc hoàn thiện hồ sơ đến khi lớp
              học vận hành ổn định.
            </figcaption>
          </figure>

          <aside className="relative mt-7 rounded-[2rem] border border-primary/10 bg-[#f8f7ff] p-5 shadow-[0_22px_65px_rgba(40,15,145,0.14)] sm:p-7 lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-0">
            <h3 className="font-nunito text-xl font-extrabold leading-snug text-primary sm:text-2xl">
              Bạn tập trung vào việc dạy
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">
              BeeWise hỗ trợ những phần việc còn lại trong quá trình vận hành
              lớp học.
            </p>

            <div className="mt-5">
              {SUPPORT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-t border-primary/10 py-5 sm:gap-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-[0_8px_24px_rgba(40,15,145,0.08)] transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <Icon size={21} weight="duotone" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-nunito text-base font-extrabold leading-snug text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-5 text-foreground/60">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
