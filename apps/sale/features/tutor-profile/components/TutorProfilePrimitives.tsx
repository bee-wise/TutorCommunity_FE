import type { LucideIcon } from "lucide-react";
import { Star } from "lucide-react";
import type { ReactNode } from "react";

interface SectionShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

interface InfoPillProps {
  icon?: LucideIcon;
  children: ReactNode;
  tone?: "primary" | "secondary" | "accent" | "neutral" | "success";
}

interface RatingStarsProps {
  value: number;
  size?: number;
  showValue?: boolean;
}

const pillToneClassName = {
  primary: "border-[#280f91]/15 bg-[#280f91]/8 text-[#280f91]",
  secondary: "border-[#447353]/20 bg-[#447353]/8 text-[#447353]",
  accent: "border-[#ffc500]/45 bg-[#fff3cb] text-[#905b0f]",
  neutral: "border-[#cfe1fa] bg-white text-[#0c0c0b]/70",
  success: "border-[#447353]/20 bg-[#447353]/8 text-[#447353]",
};

export function SectionShell({
  eyebrow,
  description,
  icon: Icon,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      className={`rounded-3xl border border-[#cfe1fa] bg-white p-5 shadow-[0_18px_48px_-30px_rgba(40,15,145,0.2)] sm:p-6 ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cfe1fa] bg-[#cfe1fa]/35 px-3.5 py-2 text-[#280f91] shadow-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon size={15} aria-hidden="true" />
            </span>
            {eyebrow ? (
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#447353]">
                {eyebrow}
              </span>
            ) : null}
          </div>
          <div className="hidden h-px flex-1 bg-[#cfe1fa]/80 sm:block" />
        </div>

        {description ? (
          <p className="max-w-xl text-sm leading-6 text-[#0c0c0b]/60">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function InfoPill({
  icon: Icon,
  children,
  tone = "neutral",
}: InfoPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm ${pillToneClassName[tone]}`}
    >
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function RatingStars({
  value,
  size = 15,
  showValue = false,
}: RatingStarsProps) {
  const roundedValue = Math.round(value);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${value} sao`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={
              index < roundedValue ? "text-[#ffc500]" : "text-[#0c0c0b]/20"
            }
            fill={index < roundedValue ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-sm font-black text-[#0c0c0b]">
          {value.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
