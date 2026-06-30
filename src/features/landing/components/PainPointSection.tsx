import {
  Clock,
  ShieldWarning,
  ChatCircleDots,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { PAIN_POINTS } from "../data/landing.data";

const ICON_MAP = {
  Clock,
  ShieldWarning,
  ChatCircleDots,
  MagnifyingGlass,
} as const;

type IconKey = keyof typeof ICON_MAP;

export function PainPointSection() {
  return (
    <section
      className="bg-white py-20 sm:py-24"
      id="pain-points"
      aria-labelledby="pain-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <h2
            id="pain-headline"
            className="text-3xl sm:text-4xl tracking-tight text-foreground mb-4"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
          >
            Tìm Gia Sư Đôi Khi Khó Hơn Bạn Nghĩ
          </h2>
          <p className="text-foreground/60 leading-relaxed">
            Có lẽ bạn đã từng gặp một trong những tình huống này.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PAIN_POINTS.map((point) => {
            const Icon = ICON_MAP[point.icon as IconKey];
            return (
              <div
                key={point.id}
                className="flex gap-4 p-6 rounded-2xl bg-muted border border-border hover:border-primary/30 transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Icon
                    size={20}
                    weight="duotone"
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

