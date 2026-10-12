import { Button } from "@workspace/ui/components/ui/button";

export type ReviewTab = "newProfiles" | "resubmittedProfiles" | "fieldChanges";

const tabs: { value: ReviewTab; label: string }[] = [
  { value: "newProfiles", label: "Hồ sơ mới" },
  { value: "resubmittedProfiles", label: "Duyệt lại hồ sơ" },
  { value: "fieldChanges", label: "Thay đổi thông tin" },
];

export function ReviewQueueTabs({
  value,
  counts,
  onChange,
}: {
  value: ReviewTab;
  counts: Record<ReviewTab, number | null>;
  onChange: (tab: ReviewTab) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-background p-1" role="tablist" aria-label="Loại yêu cầu xét duyệt">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          role="tab"
          variant="ghost"
          size="sm"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`min-h-10 shrink-0 gap-2 rounded-lg px-3.5 font-bold transition-all active:scale-[0.98] ${value === tab.value ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground hover:bg-muted/40 hover:text-primary"}`}
        >
          {tab.label}
          <span
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-extrabold leading-none text-accent-foreground"
            aria-label={counts[tab.value] === null ? "Chưa có dữ liệu" : `${counts[tab.value]} yêu cầu`}
          >
            {counts[tab.value] ?? "—"}
          </span>
        </Button>
      ))}
    </div>
  );
}
