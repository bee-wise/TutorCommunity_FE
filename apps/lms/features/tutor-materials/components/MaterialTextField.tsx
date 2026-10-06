import { useFormContext, type FieldPath } from "react-hook-form";
import type { AIAnalyzeResponse } from "../types";
import { inputClass } from "./materials-ui";

export function MaterialTextField({ name, label, multiline = false }: {
  name: FieldPath<AIAnalyzeResponse>; label: string; multiline?: boolean;
}) {
  const { register, getFieldState, formState } = useFormContext<AIAnalyzeResponse>();
  const { error } = getFieldState(name, formState);
  const id = `material-${name}`;
  return <div><label htmlFor={id} className="mb-2 block text-sm font-bold">{label}</label>{multiline ? <textarea id={id} {...register(name)} rows={3} className={`${inputClass} resize-y`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} /> : <input id={id} {...register(name)} className={inputClass} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />}{error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">{error.message}</p>}</div>;
}
