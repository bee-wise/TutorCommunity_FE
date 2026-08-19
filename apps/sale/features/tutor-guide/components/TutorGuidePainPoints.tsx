import {
  ChatCircleTextIcon,
  CurrencyCircleDollarIcon,
  MagnifyingGlassIcon,
  ShieldWarningIcon,
} from "@phosphor-icons/react/dist/ssr";

const PAIN_POINTS = [
  {
    id: "search",
    icon: MagnifyingGlassIcon,
    number: "01",
    title: "Tìm lớp mất nhiều thời gian",
    text: "Bài đăng trôi nhanh, nhu cầu thiếu rõ ràng và khó biết học viên có thực sự phù hợp hay không.",
    badge: "Tìm kiếm lớp học",
  },
  {
    id: "fee",
    icon: CurrencyCircleDollarIcon,
    number: "02",
    title: "Phí nhận lớp thiếu minh bạch",
    text: "Gia sư thường phải trả tiền trước khi có đủ thông tin để đánh giá cơ hội giảng dạy.",
    badge: "Chi phí & Hoa hồng",
  },
  {
    id: "trust",
    icon: ShieldWarningIcon,
    number: "03",
    title: "Năng lực khó được ghi nhận",
    text: "Bằng cấp, kinh nghiệm và phương pháp dạy dễ bị thu gọn thành vài dòng giới thiệu chung chung.",
    badge: "Hồ sơ & Uy tín",
  },
  {
    id: "support",
    icon: ChatCircleTextIcon,
    number: "04",
    title: "Thiếu người hỗ trợ khi kết nối",
    text: "Khi lịch học hoặc kỳ vọng thay đổi, gia sư thường phải tự xử lý toàn bộ trao đổi với học viên.",
    badge: "Hỗ trợ & Tư vấn",
  },
];

export function TutorGuidePainPoints() {
  return (
    <section
      className="bg-primary py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="pain-points-heading"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <h2
            id="pain-points-heading"
            className="font-nunito uppercase text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight text-primary-foreground"
          >
            Không cần rải hồ sơ
            <br />
            <span className="text-accent">khắp nơi nữa</span>
          </h2>
          <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-primary-foreground/70">
            BeeWise được xây dựng để bạn tìm học viên dễ dàng, tập trung hơn và
            hơn nữa giúp bạn quản lý dễ dàng hơn.
          </p>
        </div>

        {/* Zigzag Card Layout — image placeholder on alternating sides */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {PAIN_POINTS.map((point, index) => {
            const Icon = point.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={point.id}
                className={`group flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-0 rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/8 transition-all duration-300`}
              >
                {/* Image placeholder — user will add image later */}
                <div className="relative lg:w-[45%] min-h-52 sm:min-h-64 lg:min-h-72 bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {/* Placeholder pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,197,0,0.4) 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 text-primary-foreground/40">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-primary-foreground/20 flex items-center justify-center">
                      <Icon size={28} className="text-primary-foreground/30" />
                    </div>
                    <span className="text-xs font-medium tracking-wider uppercase">
                      Ảnh LMS sẽ hiển thị tại đây
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-4 p-7 sm:p-9 lg:p-10">
                  {/* Number + Badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-white/10 font-nunito leading-none select-none">
                      {point.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold border border-accent/30">
                      {point.badge}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                      <Icon
                        size={22}
                        weight="bold"
                        className="text-accent-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-nunito text-xl sm:text-2xl font-extrabold text-primary-foreground leading-tight">
                        {point.title}
                      </h3>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-primary-foreground/65 max-w-[46ch]">
                        {point.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
