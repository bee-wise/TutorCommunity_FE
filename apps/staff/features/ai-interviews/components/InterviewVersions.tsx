import { CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { interviewDate } from "../utils/interview-presentation";
import { actionClass } from "./InterviewUi";

type VersionItem = {
  version: string;
  is_active: boolean;
  created_at: string;
  is_default?: boolean;
};
export function InterviewVersions({
  items,
  selected,
  onSelect,
  disabled = false,
}: {
  items: VersionItem[];
  selected: string;
  onSelect: (version: string) => void;
  disabled?: boolean;
}) {
  return (
    <nav
      aria-label="Phiên bản cấu hình"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <p className="border-b border-border px-4 py-3 text-xs font-bold text-muted-foreground">
        PHIÊN BẢN · {items.length}
      </p>
      <div className="max-h-[560px] overflow-y-auto p-2">
        {items.map((item) => (
          <Button
            key={item.version}
            variant="ghost"
            disabled={disabled}
            aria-pressed={selected === item.version}
            onClick={() => onSelect(item.version)}
            className={`${actionClass} mb-1 h-auto w-full justify-start gap-3 whitespace-normal rounded-xl px-3 py-3 text-left ${selected === item.version ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}
          >
            {item.is_active ? (
              <CheckCircleIcon className="size-5 shrink-0 text-secondary" />
            ) : (
              <DocumentTextIcon className="size-5 shrink-0 text-muted-foreground" />
            )}
            <span className="min-w-0">
              <span className="block break-all text-sm font-bold">
                {item.version}
              </span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {item.is_active
                  ? "Đang áp dụng"
                  : item.is_default
                    ? "Bản dự phòng"
                    : "Chưa áp dụng"}
              </span>
              <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                {interviewDate(item.created_at)}
              </span>
            </span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
export function InterviewVersionStatus({
  active,
  fallback,
}: {
  active: boolean;
  fallback?: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${active ? "border-secondary/20 bg-secondary/10 text-secondary" : "border-border bg-muted/50 text-muted-foreground"}`}
    >
      {active ? "Đang áp dụng" : fallback ? "Bản dự phòng" : "Chưa áp dụng"}
    </span>
  );
}
