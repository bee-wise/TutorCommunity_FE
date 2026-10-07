import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { AIAnalyzeResponse } from "../types";
import { MaterialTextField } from "./MaterialTextField";
import { outlineActionClass, inputClass } from "./materials-ui";

function ConceptFields({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control } = useFormContext<AIAnalyzeResponse>();
  const formulas = useFieldArray({ control, name: `summary.key_concepts.${index}.formulas` });
  return <div className="space-y-4 rounded-3xl border border-border p-4"><MaterialTextField name={`summary.key_concepts.${index}.name`} label="Tên ý chính" /><MaterialTextField name={`summary.key_concepts.${index}.explanation`} label="Giải thích" multiline />{formulas.fields.map((field, formulaIndex) => <div key={field.id} className="space-y-3 rounded-2xl border border-border p-3"><MaterialTextField name={`summary.key_concepts.${index}.formulas.${formulaIndex}.latex`} label="Công thức LaTeX" multiline /><MaterialTextField name={`summary.key_concepts.${index}.formulas.${formulaIndex}.description`} label="Mô tả công thức" /><button type="button" onClick={() => formulas.remove(formulaIndex)} className={outlineActionClass}>Xóa công thức</button></div>)}<div className="flex flex-wrap gap-2"><button type="button" onClick={() => formulas.append({ latex: "", description: "" })} className={outlineActionClass}>Thêm công thức</button><button type="button" onClick={onRemove} className={outlineActionClass}>Xóa ý chính</button></div></div>;
}

export function SummaryEditorFields() {
  const { control } = useFormContext<AIAnalyzeResponse>();
  const concepts = useFieldArray({ control, name: "summary.key_concepts" });
  return <section className="space-y-5"><h2 className="text-xl text-primary">Tóm tắt lý thuyết</h2><MaterialTextField name="summary.title" label="Tiêu đề tài liệu" /><MaterialTextField name="summary.overview" label="Tổng quan" multiline />
    <label className="grid gap-2 text-sm font-bold">Kiến thức cần nhớ (mỗi dòng một ý)<Controller control={control} name="summary.prerequisites" render={({ field }) => <textarea rows={3} className={inputClass} value={field.value.join("\n")} onBlur={field.onBlur} ref={field.ref} onChange={(event) => field.onChange(event.target.value.split("\n"))} />} /></label>
    {concepts.fields.map((field, index) => <ConceptFields key={field.id} index={index} onRemove={() => concepts.remove(index)} />)}<button type="button" onClick={() => concepts.append({ name: "", explanation: "", formulas: [] })} className={outlineActionClass}>Thêm ý chính</button>
  </section>;
}
