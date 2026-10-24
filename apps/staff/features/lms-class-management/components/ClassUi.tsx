import type { ComponentType, ReactNode, SVGProps } from "react";

export const buttonClass =
  "min-h-11 rounded-full px-5 font-bold transition-all active:scale-[0.98]";
export const panelClass =
  "rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6";
export const fieldClass =
  "min-h-11 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function Chip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "flag" | "ok" | "danger" | "primary";
  children: ReactNode;
}) {
  const classes = {
    neutral: "border-border bg-muted text-muted-foreground",
    flag: "border-transparent bg-highlight text-foreground",
    ok: "border-transparent bg-secondary text-secondary-foreground",
    danger: "border-destructive/30 bg-card text-destructive",
    primary: "border-transparent bg-primary text-primary-foreground",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      {children}
    </span>
  );
}

const approvalLabels: Record<string, [string, "flag" | "ok" | "danger" | "neutral"]> = {
  PENDING: ["Chờ duyệt", "flag"],
  APPROVED: ["Đã duyệt", "ok"],
  REJECTED: ["Đã từ chối", "danger"],
  CHANGES_REQUESTED: ["Cần chỉnh sửa", "flag"],
  REQUEST_CHANGES: ["Cần chỉnh sửa", "flag"],
  DRAFT: ["Bản nháp", "neutral"],
  CANCELLED: ["Đã hủy", "neutral"],
};
export function StatusChip({ value }: { value: string | null | undefined }) {
  const [label, tone] = approvalLabels[value ?? ""] ?? [value ?? "—", "neutral"];
  return <Chip tone={tone}>{label}</Chip>;
}
export const billingLabels: Record<string, string> = {
  MONTHLY: "Thu theo tháng",
  FULL_COURSE: "Thu trọn khóa",
};
export const modeLabels: Record<string, string> = {
  ONLINE: "Online",
  OFFLINE: "Tại chỗ",
};
export function money(value: number | null | undefined) {
  return value == null ? "—" : `${value.toLocaleString("vi-VN")}đ`;
}
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date);
}
export function initials(name: string | null | undefined) {
  const parts = (name ?? "").split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "HV"
  );
}
export function shortId(id: string) {
  return `···${id.replace(/-/g, "").slice(-4).toUpperCase()}`;
}

export function Avatar({
  name,
  src,
}: {
  name: string | null | undefined;
  src?: string | null;
}) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-nunito text-sm font-extrabold text-primary">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function SectionTitle({
  icon,
  children,
  aside,
}: {
  icon?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="flex items-center gap-2.5 font-nunito text-lg font-extrabold">
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-primary [&>svg]:size-5">
            {icon}
          </span>
        )}
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="font-nunito text-lg font-extrabold">{title}</h3>
      {children && (
        <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
      )}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Đang tải" className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-3xl bg-muted" />
      ))}
    </div>
  );
}

export function RadioCards<T extends string>({
  name,
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  name: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  options: {
    value: T;
    label: string;
    hint: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }[];
}) {
  return (
    <div role="radiogroup" aria-label={label} className="space-y-2">
      {options.map((option) => {
        const Icon = option.icon;
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"} ${disabled ? "pointer-events-none opacity-60" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <Icon aria-hidden="true" className="size-6 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="block text-xs opacity-85">{option.hint}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
