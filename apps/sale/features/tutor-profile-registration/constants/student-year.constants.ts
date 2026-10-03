export interface StudentYearOption {
  readonly value: string;
  readonly label: string;
}

export const STUDENT_YEAR_OPTIONS: readonly StudentYearOption[] = [
  { value: "YEAR_1", label: "Sinh viên năm 1" },
  { value: "YEAR_2", label: "Sinh viên năm 2" },
  { value: "YEAR_3", label: "Sinh viên năm 3" },
  { value: "YEAR_4", label: "Sinh viên năm 4" },
  { value: "YEAR_5", label: "Sinh viên năm 5" },
  { value: "YEAR_6", label: "Sinh viên năm 6" },
  { value: "GRADUATED", label: "Đã tốt nghiệp" },
] as const;

export const STUDENT_YEAR_VALUES = [
  "YEAR_1",
  "YEAR_2",
  "YEAR_3",
  "YEAR_4",
  "YEAR_5",
  "YEAR_6",
  "GRADUATED",
] as const;

export type StudentYearValue = (typeof STUDENT_YEAR_VALUES)[number];
