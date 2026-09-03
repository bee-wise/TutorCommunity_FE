import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface ProfileFieldProps {
  id: string;
  label: string;
  description?: string;
  reviewRequired?: boolean;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  inputMode?: "text" | "url";
  type?: "text" | "file";
  accept?: string;
  options?: { value: string; label: string }[];
}

const fieldClassName =
  "w-full rounded-xl border border-[#c7d6eb] bg-white px-3 py-2.5 text-sm leading-6 text-[#0c0c0b] outline-none transition placeholder:text-[#667085] focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/18 aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:ring-[#e1aba7]/35";

export function ProfileField({
  id,
  label,
  description,
  reviewRequired = false,
  error,
  registration,
  multiline = false,
  rows = 4,
  placeholder,
  inputMode = "text",
  type = "text",
  accept,
  options,
}: ProfileFieldProps) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const describedBy = error
    ? `${description ? descriptionId : ""} ${errorId}`.trim()
    : description
      ? descriptionId
      : undefined;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="text-sm font-bold text-[#17142f]">
          {label}
        </label>
        {reviewRequired ? (
          <span className="rounded-full bg-[#fff3cb] px-2 py-0.5 text-[11px] font-bold text-[#765000]">
            Cần duyệt lại
          </span>
        ) : null}
      </div>
      {description ? (
        <p id={descriptionId} className="text-xs leading-5 text-[#56516a]">
          {description}
        </p>
      ) : null}
      {options ? (
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${fieldClassName} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[length:1.25em_1.25em] bg-no-repeat pr-10`}
          {...registration}
        >
          <option value="" disabled hidden>
            {placeholder || "Vui lòng chọn..."}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${fieldClassName} resize-y`}
          {...registration}
        />
      ) : (
        <input
          id={id}
          type={type === "file" ? "file" : inputMode === "url" ? "url" : "text"}
          inputMode={type === "file" ? undefined : inputMode}
          accept={accept}
          placeholder={type === "file" ? undefined : placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={
            type === "file"
              ? "block w-full text-sm text-[#56516a] file:mr-4 file:rounded-full file:border-0 file:bg-[#280f91]/10 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-[#280f91] hover:file:bg-[#280f91]/20 cursor-pointer focus:outline-none"
              : fieldClassName
          }
          {...registration}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-semibold text-[#9f2017]">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
