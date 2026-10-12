import type { InterviewReport } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";

export function InterviewConflicts({
  conflicts,
}: {
  conflicts: InterviewReport["data_conflicts"];
}) {
  if (!conflicts.length) return null;
  return (
    <div className="mt-5 border-t border-border pt-5">
      <h3 className="font-nunito font-extrabold">
        Mâu thuẫn cần xác minh{" "}
        <span className="ml-2 rounded-full bg-accent/20 px-2 py-1 text-xs">
          {conflicts.length}
        </span>
      </h3>
      <div className="mt-4 space-y-3">
        {conflicts.map((item, index) => (
          <DisclosureCard
            key={index}
            defaultOpen={index === 0}
            title={`${item.q_code} · ${item.profile.label}`}
            variant="outline"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  TRONG PHỎNG VẤN
                </p>
                <blockquote className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  “{item.interview_quote}”
                </blockquote>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  TRONG HỒ SƠ
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {item.profile.text}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium">{item.note}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.criterion_codes.join(", ")} ·{" "}
              {item.status === "OPEN" ? "Chưa xác minh" : item.status}
            </p>
          </DisclosureCard>
        ))}
      </div>
    </div>
  );
}
