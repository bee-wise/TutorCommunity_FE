export type ReviewTab = "newProfiles" | "resubmittedProfiles" | "fieldChanges";

const tabs: { value: ReviewTab; label: string; hint: string }[] = [
  { value: "newProfiles", label: "Hồ sơ mới", hint: "Chưa được duyệt lần nào" },
  {
    value: "resubmittedProfiles",
    label: "Duyệt lại hồ sơ",
    hint: "Gia sư đã chỉnh sửa và gửi lại",
  },
  {
    value: "fieldChanges",
    label: "Thay đổi thông tin",
    hint: "Xin sửa thông tin đã được duyệt",
  },
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
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="tablist"
      aria-label="Loại yêu cầu xét duyệt"
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        const count = counts[tab.value];
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`flex min-h-11 items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] ${active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card hover:-translate-y-0.5 hover:shadow-soft-hover"}`}
          >
            <span className="min-w-0">
              <span className="block text-sm font-extrabold">{tab.label}</span>
              <span
                className={`mt-0.5 block text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {tab.hint}
              </span>
            </span>
            <span
              className={`font-nunito text-3xl font-black leading-none tabular-nums ${active ? "text-accent" : "text-primary"}`}
              aria-label={
                count === null ? "Chưa có dữ liệu" : `${count} yêu cầu`
              }
            >
              {count ?? "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
