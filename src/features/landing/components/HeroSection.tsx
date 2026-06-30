import Link from "next/link";
import { ShieldCheck, ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { HeroMotion } from "./HeroMotion";

const TRUST_STATS = [
  {
    icon: ClockIcon,
    value: "Tiết kiệm",
    label: "Gợi ý gia sư phù hợp",
    sub: "Phân tích nhu cầu, ngân sách, mục tiêu và tìm nhanh hơn nhờ AI",
    color: "text-[#280F91]",
    bg: "bg-[#280F91]/8",
    valueCls: "text-[#280F91]",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Hồ sơ xác thực",
    sub: "Đội ngũ cố vấn kiểm duyệt trước khi hiển thị",
    color: "text-[#447353]",
    bg: "bg-[#447353]/10",
    valueCls: "text-[#447353]",
  },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-white"
      aria-labelledby="hero-headline"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 85%, rgba(255,197,0,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(40,15,145,0.07) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <HeroMotion>
            <div className="flex flex-col gap-7">
              <h1
                id="hero-headline"
                className="font-montserrat text-[2.5rem] sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-normal text-[#280F91]"
                style={{
                  fontWeight: 800,
                }}
              >
                Tìm Gia Sư Phù Hợp{" "}
                <span className="text-[#FFC500]">Trong 30 Giây</span>
              </h1>

              <p className="text-base sm:text-lg text-[#0C0C0B]/60 leading-relaxed max-w-[50ch]">
                Chỉ cần cho BeeWise biết bạn cần học gì. AI gợi ý gia sư phù hợp
                nhất dựa trên nhu cầu, ngân sách và mục tiêu của bạn. Mọi hồ sơ
                đều được xác thực.
              </p>

              <div
                className="relative rounded-2xl p-3.5 flex items-center gap-3 border border-[#dce8fb] bg-[#f5f8ff]"
                style={{
                  boxShadow: "0 2px 12px rgba(40,15,145,0.06)",
                }}
              >
                <input
                  type="text"
                  id="hero-ai-search"
                  placeholder='Ví dụ: "Gia sư Toán lớp 12, học online, 200.000đ/buổi"'
                  className="flex-1 bg-transparent text-sm text-[#0C0C0B] placeholder-[#0C0C0B]/35 outline-none min-w-0"
                  aria-label="Nhập nhu cầu tìm gia sư"
                />
                <Link
                  href="/tutors"
                  id="hero-cta-primary"
                  className="shrink-0 inline-flex h-9 items-center justify-center rounded-full bg-[#280F91] px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1a0a6b] active:scale-[0.98] whitespace-nowrap"
                >
                  Tìm Ngay
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/tutors"
                  id="hero-cta-secondary"
                  className="inline-flex h-10 items-center justify-center rounded-full border-2 border-[#280F91] px-6 text-sm font-semibold text-[#280F91] transition-all duration-200 hover:bg-[#280F91] hover:text-white active:scale-[0.98]"
                >
                  Xem Danh Sách Gia Sư
                </Link>
              </div>
            </div>
          </HeroMotion>

          <div className="flex flex-col gap-6 w-full max-w-sm mx-auto lg:ml-auto">
            {TRUST_STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <HeroMotion key={stat.label} delay={0.2 + index * 0.15}>
                  <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-[#dce8fb] shadow-sm hover:shadow-md hover:border-[#280F91]/20 transition-all duration-200">
                    <div className="flex gap-3 items-end">
                      <div
                        className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                      >
                        <Icon
                          size={24}
                          weight="fill"
                          className={stat.color}
                          aria-hidden="true"
                        />
                      </div>
                      <p
                        className={`text-3xl leading-none mb-1.5 ${stat.valueCls ?? stat.color}`}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 800,
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-sm font-semibold text-[#0C0C0B]/75 mb-1.5"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {stat.label}
                      </p>
                      <p className="text-sm text-[#0C0C0B]/50 leading-snug">
                        {stat.sub}
                      </p>
                    </div>
                  </div>
                </HeroMotion>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
