import {
  WarningCircleIcon,
  CurrencyCircleDollarIcon,
  UsersFourIcon,
  ChatCircleTextIcon,
} from "@phosphor-icons/react/dist/ssr";

const PAIN_POINTS = [
  {
    id: "fee",
    icon: CurrencyCircleDollarIcon,
    text: "Phải đóng phí nhận lớp ngay từ đầu.",
  },
  {
    id: "search",
    icon: UsersFourIcon,
    text: "Mất nhiều thời gian tìm học viên trên Facebook hoặc các hội nhóm.",
  },
  {
    id: "trust",
    icon: WarningCircleIcon,
    text: "Lo ngại trung tâm thiếu minh bạch hoặc thanh toán chậm.",
  },
  {
    id: "support",
    icon: ChatCircleTextIcon,
    text: "Không có người hỗ trợ khi phát sinh vấn đề trong quá trình dạy.",
  },
];

export function TutorGuidePainPoints() {
  return (
    <section
      className="py-20 sm:py-24 bg-background h-screen flex items-center"
      aria-labelledby="pain-points-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Heading */}
          <div className="flex flex-col gap-6">
            <h2
              id="pain-points-heading"
              className="tracking-tight leading-tight text-foreground"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              }}
            >
              Vì sao nhiều gia sư{" "}
              <span className="text-accent">gặp khó khăn</span> khi tìm lớp?
            </h2>
            <p className="text-foreground/60 leading-relaxed max-w-[45ch]">
              BeeWise được xây dựng để giải quyết những khó khăn này bằng một
              nền tảng quản lý tập trung và minh bạch hơn.
            </p>

            {/* Accent underline bar */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <div className="h-1 w-4 rounded-full bg-accent" />
              <div className="h-1 w-2 rounded-full bg-secondary" />
            </div>
          </div>

          {/* Right: Pain points list */}
          <ul className="flex flex-col gap-4" role="list">
            {PAIN_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <li
                  key={point.id}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-accent bg-muted/40 hover:border-primary/20 hover:bg-muted/70 transition-all duration-200"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,197,0,0.15)" }}
                  >
                    <Icon
                      size={20}
                      className="text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-primary/75 leading-relaxed pt-1">
                    {point.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
