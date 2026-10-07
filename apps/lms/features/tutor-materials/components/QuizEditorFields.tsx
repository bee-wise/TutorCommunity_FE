import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { AIAnalyzeResponse } from "../types";
import { MaterialTextField } from "./MaterialTextField";
import { MaterialsSelect } from "./MaterialsSelect";
import { outlineActionClass } from "./materials-ui";

function QuestionFields({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control } = useFormContext<AIAnalyzeResponse>();
  const options = useWatch({ control, name: `quiz.multiple_choice.${index}.options` });
  return <div className="space-y-4 rounded-3xl border border-border p-4"><h3 className="text-lg text-primary">Câu {index + 1}</h3><MaterialTextField name={`quiz.multiple_choice.${index}.question`} label="Câu hỏi" multiline />{options.map((option, optionIndex) => <MaterialTextField key={optionIndex} name={`quiz.multiple_choice.${index}.options.${optionIndex}.content`} label={`Lựa chọn ${option.label}`} multiline />)}<div><p className="mb-2 text-sm font-bold">Đáp án đúng</p><Controller control={control} name={`quiz.multiple_choice.${index}.correct_answer`} render={({ field }) => <MaterialsSelect label={`Đáp án câu ${index + 1}`} value={field.value} onChange={field.onChange} options={options.map((option) => ({ value: option.label, label: option.label }))} />} /></div><MaterialTextField name={`quiz.multiple_choice.${index}.explanation`} label="Giải thích đáp án" multiline /><button type="button" onClick={onRemove} className={outlineActionClass}>Xóa câu hỏi</button></div>;
}

function EssayFields({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control } = useFormContext<AIAnalyzeResponse>();
  const steps = useFieldArray({ control, name: `quiz.exercises.${index}.solution_steps` });
  return <div className="space-y-4 rounded-3xl border border-border p-4"><h3 className="text-lg text-primary">Bài tự luận {index + 1}</h3><MaterialTextField name={`quiz.exercises.${index}.problem`} label="Đề bài" multiline />{steps.fields.map((step, stepIndex) => <div key={step.id} className="space-y-2"><MaterialTextField name={`quiz.exercises.${index}.solution_steps.${stepIndex}.description`} label={`Hướng dẫn giải ${stepIndex + 1}`} multiline /><button type="button" onClick={() => steps.remove(stepIndex)} className={outlineActionClass}>Xóa hướng dẫn</button></div>)}<button type="button" onClick={() => steps.append({ step_number: steps.fields.length + 1, description: "" })} className={outlineActionClass}>Thêm hướng dẫn</button><MaterialTextField name={`quiz.exercises.${index}.final_answer`} label="Kết quả" multiline /><button type="button" onClick={onRemove} className={outlineActionClass}>Xóa bài tự luận</button></div>;
}

export function QuizEditorFields() {
  const { control } = useFormContext<AIAnalyzeResponse>();
  const questions = useFieldArray({ control, name: "quiz.multiple_choice" });
  const essays = useFieldArray({ control, name: "quiz.exercises" });
  return <section className="space-y-5"><h2 className="text-xl text-primary">Bài tập</h2>{questions.fields.map((field, index) => <QuestionFields key={field.id} index={index} onRemove={() => questions.remove(index)} />)}<button type="button" onClick={() => questions.append({ question: "", options: ["A", "B", "C", "D"].map((label) => ({ label, content: "" })), correct_answer: "A", explanation: "", difficulty: "medium" })} className={outlineActionClass}>Thêm câu trắc nghiệm</button>{essays.fields.map((field, index) => <EssayFields key={field.id} index={index} onRemove={() => essays.remove(index)} />)}<button type="button" onClick={() => essays.append({ problem: "", solution_steps: [], final_answer: "", difficulty: "medium" })} className={outlineActionClass}>Thêm bài tự luận</button></section>;
}
