import { SOLUTION_FEATURES } from "../data/landing.data";
import { SolutionMotion } from "./SolutionMotion";

const CELL_STYLES: Record<string, string> = {
  primary: "bg-[#280F91] text-white col-span-1 sm:col-span-2",
  secondary: "bg-[#447353] text-white",
  neutral: "bg-[#f0f4ff] text-[#0C0C0B] border border-[#dce8fb]",
  accent: "bg-[#FFC500] text-[#0C0C0B]",
};

export function SolutionSection() {
  return (
    <section
      className="bg-white py-20 sm:py-24"
      id="solutions"
      aria-labelledby="solution-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="max-w-xl lg:sticky lg:top-32">
            <h2
              id="solution-headline"
              className="text-3xl sm:text-4xl tracking-tight text-primary mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              BeeWise Giúp Việc Tìm Gia Sư Trở Nên Đơn Giản Hơn
            </h2>
            <p className="text-[#0C0C0B]/60 leading-relaxed">
              Bốn tính năng cốt lõi được thiết kế để giải quyết đúng vấn đề bạn
              đang gặp phải.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-[minmax(200px,auto)]">
            {SOLUTION_FEATURES.map((feature, index) => (
              <SolutionMotion key={feature.id} index={index}>
                <div
                  className={`rounded-2xl p-7 flex flex-col justify-between h-full ${CELL_STYLES[feature.variant]}`}
                >
                  <div className="flex flex-col gap-3">
                    <h3
                      className="leading-tight text-[1.5rem]"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        feature.variant === "neutral"
                          ? "text-[#0C0C0B]/65"
                          : feature.variant === "accent"
                            ? "text-[#0C0C0B]/70"
                            : "text-white/75"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </SolutionMotion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
