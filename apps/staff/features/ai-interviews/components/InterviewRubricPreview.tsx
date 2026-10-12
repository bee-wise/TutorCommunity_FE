import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  rubricFieldLabels,
  rubricEntryTitle,
} from "../utils/rubric-presentation";

export function InterviewRubricPreview({
  content,
}: {
  content: Record<string, unknown>;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(content).map(([key, value]) => (
        <ConfigValue key={key} name={key} value={value} />
      ))}
      <DisclosureCard title="Dữ liệu cấu hình đầy đủ (JSON)" variant="subtle">
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all text-xs leading-6">
          {JSON.stringify(content, null, 2)}
        </pre>
      </DisclosureCard>
    </div>
  );
}
function ConfigValue({
  name,
  value,
  depth = 0,
}: {
  name: string;
  value: unknown;
  depth?: number;
}) {
  const label = rubricFieldLabels[name] ?? name;
  if (value == null || typeof value !== "object")
    return (
      <div className="grid gap-1 border-b border-border/60 py-3 text-sm last:border-0 sm:grid-cols-[180px_minmax(0,1fr)]">
        <span className="text-muted-foreground">{label}</span>
        <span className="break-words whitespace-pre-wrap leading-6 font-medium">
          {typeof value === "boolean"
            ? value
              ? "Bật"
              : "Tắt"
            : String(value ?? "—")}
        </span>
      </div>
    );
  if (depth > 8)
    return (
      <p className="text-xs text-muted-foreground">
        Xem cấu trúc lồng sâu trong dữ liệu JSON đầy đủ.
      </p>
    );
  return (
    <DisclosureCard
      title={`${label}${Array.isArray(value) ? ` · ${value.length} mục` : ""}`}
      variant="outline"
    >
      <div className="space-y-3">
        {Array.isArray(value)
          ? value.map((item: unknown, index: number) => {
              const title = rubricEntryTitle(item, `${label} ${index + 1}`);
              return (
                <ConfigValue
                  key={index}
                  name={title}
                  value={item}
                  depth={depth + 1}
                />
              );
            })
          : Object.entries(value).map(([key, item]) => (
              <ConfigValue
                key={key}
                name={key}
                value={item}
                depth={depth + 1}
              />
            ))}
      </div>
    </DisclosureCard>
  );
}
