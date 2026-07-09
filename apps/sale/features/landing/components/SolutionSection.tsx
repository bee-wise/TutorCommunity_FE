import { SOLUTION_FEATURES } from "../data/landing.data";
import { SolutionMotion } from "./SolutionMotion";
import { HeroVisual } from "./HeroVisual";

const CELL_STYLES: Record<string, string> = {
  primary: "bg-primary text-primary-foreground col-span-1 sm:col-span-2",
  accent: "bg-accent text-primary",
};

export function SolutionSection() {
  return (
    <section
      className="bg-background sm:py-24"
      id="solutions"
      aria-labelledby="solution-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Cột trái (Sticky) - Chỉ hiển thị trên Desktop */}
          <div className="hidden lg:flex flex-col max-w-xl sticky top-32 justify-center w-full">
            <div
              className="w-full max-w-[420px] mx-auto origin-top"
              style={{ transform: "scale(0.95)" }}
            >
              <HeroVisual />
            </div>
          </div>

          {/* Cột phải (Danh sách tính năng) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-[minmax(200px,auto)]">
            {SOLUTION_FEATURES.map((feature, index) => (
              <SolutionMotion key={feature.id} index={index}>
                <div
                  className={`rounded-2xl p-7 flex flex-col justify-between h-full ${CELL_STYLES[feature.variant]}`}
                >
                  <div className="flex flex-col gap-3">
                    <h3
                      className="leading-tight uppercase text-[1.05rem]"
                      style={{
                        fontFamily: "var(--font-google-sans)",
                        fontWeight: 700,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </SolutionMotion>
            ))}

            {/* HeroVisual hiển thị trên Mobile/Tablet ở cuối danh sách tính năng */}
            <div className="lg:hidden sm:col-span-2 mt-8 flex justify-center w-full">
              <div
                className="w-full max-w-[400px] mx-auto origin-top"
                style={{ transform: "scale(0.9)" }}
              >
                <HeroVisual />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
