import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import type { RubricValue } from "../services/rubric-config";
import { actionClass, fieldClass } from "./InterviewUi";

const labels: Record<string, string> = {
  questions: "Câu hỏi", criteria: "Tiêu chí chấm điểm", thresholds: "Ngưỡng đánh giá", timing: "Thời gian",
  prep_seconds: "Thời gian chuẩn bị (giây)", answer_seconds: "Thời gian trả lời (giây)",
  weight: "Trọng số", max_points: "Điểm tối đa", levels: "Thang điểm 0–4", title: "Tiêu đề",
  text: "Nội dung", prompt: "Câu hỏi phỏng vấn", objective: "Mục tiêu", description: "Mô tả",
  intro: "Lời mở đầu", outro: "Lời kết", language: "Ngôn ngữ", version: "Phiên bản nguồn",
  followup: "Câu hỏi bổ sung", q_code: "Mã câu hỏi", criterion_code: "Mã tiêu chí",
  meta: "Thông tin chung", pass: "Ngưỡng đạt", weights: "Trọng số",
};

export function InterviewRubricFields({ name, value, onChange, path = "rubric", depth = 0 }: {
  name: string; value: RubricValue; onChange: (value: RubricValue) => void; path?: string; depth?: number;
}) {
  const label = labels[name] ?? name;
  if (typeof value === "boolean") return <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" className="peer sr-only" checked={value} onChange={(event) => onChange(event.target.checked)} /><span className="flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-border bg-background transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring active:scale-95">{value && <CheckIcon className="size-4" />}</span>{label}</label>;
  if (typeof value === "number") return <label className="block text-sm font-medium">{label}<input aria-label={path} type="number" step="any" value={value} className={`mt-2 ${fieldClass}`} onChange={(event) => { if (Number.isFinite(event.target.valueAsNumber)) onChange(event.target.valueAsNumber); }} /></label>;
  if (typeof value === "string") return <label className="block text-sm font-medium">{label}<textarea aria-label={path} value={value} rows={value.includes("\n") || value.length > 100 ? 4 : 2} className={`mt-2 ${fieldClass}`} onChange={(event) => onChange(event.target.value)} readOnly={name === "version"} /></label>;
  if (depth > 8) return <p className="text-sm text-muted-foreground">Cấu hình lồng sâu. Chỉnh trong mục JSON bên dưới.</p>;
  if (Array.isArray(value)) return <DisclosureCard defaultOpen={depth < 2} variant="outline" title={`${label} · ${value.length}`} className="min-w-0"><div className="space-y-4">
    {value.map((entry, index) => <div key={index} className="min-w-0 space-y-3 border-b border-border pb-4 last:border-0"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-muted-foreground">{label} {index + 1}</span><Button type="button" size="icon" variant="ghost" className={actionClass} aria-label={`Xóa ${path} ${index + 1}`} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}><TrashIcon className="size-4" /></Button></div><InterviewRubricFields name={String(index + 1)} path={`${path}.${index}`} depth={depth + 1} value={entry} onChange={(next) => onChange(value.map((item, itemIndex) => itemIndex === index ? next : item))} /></div>)}
    {!!value.length && <Button type="button" variant="outline" size="sm" className={actionClass} onClick={() => onChange([...value, structuredClone(value[value.length - 1]!)])}><PlusIcon className="size-4" />Thêm mục {label.toLowerCase()}</Button>}
    {!value.length && <p className="text-sm text-muted-foreground">Chưa có mục. Dùng JSON để thêm cấu trúc mới.</p>}
  </div></DisclosureCard>;
  return <DisclosureCard defaultOpen={depth < 2} variant="outline" title={label} className="min-w-0"><div className="grid gap-4">{Object.entries(value).map(([key, entry]) => <InterviewRubricFields key={key} name={key} value={entry} path={`${path}.${key}`} depth={depth + 1} onChange={(next) => onChange({ ...value, [key]: next })} />)}</div></DisclosureCard>;
}
