import type { ReactNode } from "react";
import { MapPinIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";

export const widgetFieldClass =
  "min-h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-60";

export function WidgetField({
  id,
  label,
  required,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="inline-flex items-center gap-1 text-xs font-bold text-foreground"
      >
        <span>{label}</span>
        {required && <span className="text-destructive font-black">*</span>}
      </label>
      {children}
    </div>
  );
}

export function TeachingModeToggle({
  value,
  onChange,
  label,
  className = "",
}: {
  value: "ONLINE" | "OFFLINE";
  onChange: (value: "ONLINE" | "OFFLINE") => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <span className="block text-xs font-bold text-foreground">{label}</span>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
        {(
          [
            { value: "ONLINE", label: "Trực tuyến", icon: VideoCameraIcon },
            { value: "OFFLINE", label: "Trực tiếp", icon: MapPinIcon },
          ] as const
        ).map(({ value: option, label: optionLabel, icon: Icon }) => (
          <Button
            key={option}
            type="button"
            variant={value === option ? "default" : "ghost"}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`h-8 min-w-0 rounded-lg px-2 text-xs font-bold transition-all active:scale-95 ${
              value === option
                ? "shadow-xs font-bold"
                : "text-muted-foreground hover:bg-card hover:text-foreground font-semibold"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{optionLabel}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
