import Image from "next/image";
import {
  CurrencyCircleDollarIcon,
  RobotIcon,
  HeadsetIcon,
  MonitorIcon,
} from "@phosphor-icons/react/dist/ssr";

const FEATURES = [
  {
    id: "no-fee",
    icon: CurrencyCircleDollarIcon,
    sticker: null,
    stickerAlt: "",
    title: "Không phí nhận lớp",
    body: "Bạn không cần đóng tiền cọc hay phí nhận lớp trước. Học phí do gia sư đưa ra bao gồm phí hoa hồng nền tảng. Mức thu nhập của gia sư luôn được hiển thị rõ ràng trước khi bắt đầu.",
    accent: "#280f91",
    bg: "bg-white",
    textAccent: "text-primary",
  },
  {
    id: "ai-match",
    icon: RobotIcon,
    sticker: "/images/Sticker/E2-1.PNG",
    stickerAlt:
      "Bee với cây đũa phép và các con số - AI kết nối học viên phù hợp",
    title: "AI hỗ trợ kết nối học viên phù hợp",
    body: "Hệ thống AI phân tích hồ sơ chuyên môn, kinh nghiệm và môn học của bạn để đề xuất tới những học viên có nhu cầu phù hợp. Nhờ đó, bạn có thêm cơ hội tiếp cận học viên mà không cần tự chạy quảng cáo.",
    accent: "#ffc500",
    bg: "bg-primary",
    textAccent: "text-accent",
  },
  {
    id: "support",
    icon: HeadsetIcon,
    sticker: null,
    stickerAlt: "",
    title: "Đội ngũ hỗ trợ đồng hành",
    body: "Mỗi kết nối đều có sự đồng hành của đội ngũ BeeWise. Từ việc sắp xếp buổi học thử, hỗ trợ trao đổi giữa hai bên đến giải quyết các vấn đề phát sinh, bạn luôn có người hỗ trợ khi cần.",
    accent: "#447353",
    bg: "bg-white",
    textAccent: "text-secondary",
  },
  {
    id: "dashboard",
    icon: MonitorIcon,
    sticker: null,
    stickerAlt: "",
    title: "Tính năng theo dõi lớp học và thu nhập cá nhân",
    body: "Theo dõi lịch dạy, danh sách học viên, tin nhắn, thu nhập và trạng thái từng lớp — tất cả trên Dashboard cá nhân, giúp bạn dễ dàng dạy nhiều học viên cùng lúc.",
    accent: "#280f91",
    bg: "bg-muted",
    textAccent: "text-primary",
  },
];

export function TutorGuideFeatures() {
  return (
    <section
      className="py-20 sm:py-24 bg-muted"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2
            id="features-heading"
            className="tracking-tight leading-tight text-foreground mb-4"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            }}
          >
            BeeWise giúp gia sư <br />
            <span className="text-accent">an tâm giảng dạy</span>
          </h2>
          <p className="text-foreground/60 leading-relaxed max-w-[52ch]">
            Chúng tôi hỗ trợ gia sư tương lai từ kết nối học viên đến quản lý
            lớp học và cung cấp các quyền lợi bạn sẽ nhận được
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl p-8 flex flex-col gap-5 bg-card overflow-hidden group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,197,0,0.15)" }}
            >
              <CurrencyCircleDollarIcon
                size={24}
                className="text-accent"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl text-foreground leading-snug"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                {FEATURES[0].title}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                {FEATURES[0].body}
              </p>
            </div>
            <div className="mt-auto inline-flex self-start items-center gap-2 rounded-full bg-accent/8 px-4 py-2">
              <span
                className="text-xs text-accent"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                }}
              >
                Hoa hồng minh bạch
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl p-8 flex flex-col gap-5 bg-card overflow-hidden group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
            <div
              className="absolute -right-8 -bottom-6 w-44 h-44 pointer-events-none select-none"
              aria-hidden="true"
            >
              <Image
                src="/images/Sticker/E2-1.PNG"
                alt={FEATURES[1].stickerAlt}
                width={176}
                height={176}
                className="object-contain"
              />
            </div>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,197,0,0.15)" }}
            >
              <RobotIcon size={24} className="text-accent" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-3 relative z-10">
              <h3
                className="text-xl text-foreground leading-snug"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                {FEATURES[1].title}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-sm sm:text-base max-w-[36ch]">
                {FEATURES[1].body}
              </p>
            </div>
            <div className="mt-auto inline-flex self-start items-center gap-2 rounded-full bg-accent/15 px-4 py-2 relative z-10">
              <span
                className="text-xs text-accent"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                }}
              >
                Công nghệ AI
              </span>
            </div>
          </div>

          {/* Card 2: Support — with secondary color accent */}
          <div className="relative rounded-3xl border border-border p-8 flex flex-col gap-5 bg-card overflow-hidden group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,197,0,0.15)" }}
            >
              <HeadsetIcon
                size={24}
                className="text-accent"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl text-foreground leading-snug"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                {FEATURES[2].title}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                {FEATURES[2].body}
              </p>
            </div>
            <div className="mt-auto inline-flex self-start items-center gap-2 rounded-full bg-accent/15 px-4 py-2 relative z-10">
              <span
                className="text-xs text-accent"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                }}
              >
                Hỗ trợ 1-1
              </span>
            </div>
          </div>

          {/* Card 3: Dashboard — with list of tracking items */}
          <div className="relative rounded-3xl border border-border p-8 flex flex-col gap-5 bg-card overflow-hidden group hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,197,0,0.15)" }}
            >
              <MonitorIcon
                size={24}
                className="text-accent"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl text-foreground leading-snug"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                {FEATURES[3].title}
              </h3>
              {/* 2-col mini tag grid instead of bullet list */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  "Lịch dạy",
                  "Danh sách học viên",
                  "Tin nhắn",
                  "Thu nhập",
                  "Trạng thái lớp",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-sm text-foreground/70"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
