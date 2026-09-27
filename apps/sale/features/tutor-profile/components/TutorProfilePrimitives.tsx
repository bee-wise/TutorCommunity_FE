import { Star } from "lucide-react";
import type { ReactNode } from "react";

interface SectionShellProps {
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

interface InfoPillProps {
  children: ReactNode;
  tone?: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning";
  size?: "sm" | "md";
}

interface RatingStarsProps {
  value: number;
  size?: number;
  showValue?: boolean;
}

const pillToneClassName = {
  primary: "border-[#280f91]/20 bg-[#280f91]/10 text-[#280f91]",
  secondary: "border-[#447353]/30 bg-[#447353]/10 text-[#447353]",
  accent: "border-[#ffc510]/50 bg-[#fff8e6] text-[#905b0f]",
  neutral: "border-[#e8edf5] bg-[#f8faff] text-[#0c0c0b]/70",
  success: "border-[#447353]/30 bg-[#447353]/8 text-[#447353]",
  warning: "border-[#ffc510]/60 bg-[#fff3cb] text-[#905b0f]",
};

export function SectionShell({
  title,
  description,
  badge,
  children,
  className = "",
  headerAction,
}: SectionShellProps) {
  return (
    <section
      className={`rounded-2xl border border-[#e8edf5] bg-white p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(40,15,145,0.04)] ${className}`}
    >
      <div className="mb-5 flex flex-col gap-2 border-b border-[#f0f4fa] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1.5 rounded-full bg-[#280f91]" aria-hidden="true" />
            <h2 className="text-lg font-extrabold text-[#0c0c0b] sm:text-xl">{title}</h2>
            {badge ? (
              <span className="rounded-full bg-[#280f91]/10 px-2.5 py-0.5 text-xs font-bold text-[#280f91]">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 pl-4 text-xs leading-5 text-[#0c0c0b]/55 sm:text-sm">
              {description}
            </p>
          ) : null}
        </div>
        {headerAction ? <div>{headerAction}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function InfoPill({ children, tone = "neutral", size = "md" }: InfoPillProps) {
  const sizeClasses =
    size === "sm" ? "px-2.5 py-1 text-xs font-semibold" : "px-3 py-1.5 text-xs font-bold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses} ${pillToneClassName[tone]}`}
    >
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
              index < roundedValue ? "text-[#ffc500]" : "text-[#0c0c0b]/15"
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

