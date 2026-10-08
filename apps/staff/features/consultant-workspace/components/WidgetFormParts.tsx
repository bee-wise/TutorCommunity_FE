import type { ReactNode } from "react";
import { MapPinIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";

export const widgetFieldClass =
  "min-h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30";

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
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-xs font-bold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
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
    <div className={`space-y-1 ${className}`}>
      <span className="block text-xs font-bold text-foreground">{label}</span>
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-muted/40 p-1">
        {([
          { value: "ONLINE", label: "Trực tuyến", icon: VideoCameraIcon },
          { value: "OFFLINE", label: "Trực tiếp", icon: MapPinIcon },
        ] as const).map(({ value: option, label: optionLabel, icon: Icon }) => (
          <Button
            key={option}
            type="button"
            variant={value === option ? "default" : "ghost"}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`h-8 min-w-0 rounded-lg px-1.5 text-xs font-bold transition-all active:scale-[0.98] ${
              value === option
                ? "shadow-soft"
                : "text-foreground hover:bg-card hover:text-primary"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{optionLabel}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
