import type { ReactNode } from "react";
import Image from "next/image";

/** BeeWise mascots from the asset catalog (.agents/assets.md); one per screen, never over text. */
const MASCOTS = {
  pencil: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1789966160/19.png",
  flower: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1790760176/bee-flower.png",
  cheer: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1789966161/20.png",
  handshake: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1790241794/Bee_Robot_2.png",
  wand: "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1789966159/18.png",
} as const;

export type LmsMascot = keyof typeof MASCOTS;

/** Bee + robot duos are 4:3, so they get a wider slot than the single bee. */
const WIDE_MASCOTS: LmsMascot[] = ["handshake"];

interface LmsHeroBannerProps {
  title: string;
  description?: string;
  mascot?: LmsMascot;
  /** Progress, stats or actions placed under the text. */
  children?: ReactNode;
}

/** Solid primary banner with a BeeWise mascot, used at the top of the learner class screens. */
export function LmsHeroBanner({ title, description, mascot = "pencil", children }: LmsHeroBannerProps) {
  const wide = WIDE_MASCOTS.includes(mascot);
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-panel)] bg-primary p-5 text-primary-foreground shadow-soft sm:p-7">
      <div className={`relative z-10 max-w-xl space-y-4 ${wide ? "sm:pr-56" : "sm:pr-40"}`}>
        <div className="space-y-1">
          <h2 className="font-lms text-xl font-extrabold leading-[1.15] sm:text-2xl">{title}</h2>
          {description && <p className="text-sm font-medium">{description}</p>}
        </div>
        {children}
      </div>
      <div className={`pointer-events-none absolute bottom-0 right-6 top-4 hidden sm:block ${wide ? "w-44 lg:w-56" : "w-32 lg:w-40"}`} aria-hidden="true">
        <span className="lms-mascot-halo absolute inset-x-1 bottom-2 aspect-square rounded-full bg-primary-foreground/25" />
        <span className="lms-mascot-halo absolute inset-x-8 bottom-10 aspect-square rounded-full bg-primary-foreground/25 [animation-delay:-2s]" />
        <div className="lms-mascot-float absolute inset-0">
          <Image src={MASCOTS[mascot]} alt="" fill sizes={wide ? "224px" : "160px"} className="select-none object-contain object-bottom" />
        </div>
      </div>
    </section>
  );
}

/** White meter on the banner: label, big value and a progress bar. */
export function LmsHeroProgress({ label, value, max, unit = "buổi", note }: { label: string; value: number; max: number; unit?: string; note?: string }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <p className="font-lms text-3xl font-black leading-none tabular-nums">
          {value}
          <span className="text-lg font-bold">
            {" "}
            / {max} {unit}
          </span>
        </p>
        {note && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-accent-foreground">{note}</span>}
      </div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)} className="h-2 w-full overflow-hidden rounded-full bg-primary-foreground/30">
        <div className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}
