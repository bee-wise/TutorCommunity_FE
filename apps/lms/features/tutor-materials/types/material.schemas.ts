import { z } from "zod";

const difficulty = z.enum(["easy", "medium", "hard"]);
export const AIAnalyzeResponseSchema = z.object({
  summary: z.object({
    title: z.string().min(1), overview: z.string(), prerequisites: z.array(z.string()),
    key_concepts: z.array(z.object({ name: z.string(), explanation: z.string(), formulas: z.array(z.object({ latex: z.string(), description: z.string() })) })),
  }),
  quiz: z.object({
    multiple_choice: z.array(z.object({
      question: z.string(), options: z.array(z.object({ label: z.string(), content: z.string() })).min(2),
      correct_answer: z.string(), explanation: z.string(), difficulty,
    }).refine((question) => question.options.some((option) => option.label === question.correct_answer), "Đáp án đúng phải có trong các lựa chọn")),
    exercises: z.array(z.object({ problem: z.string(), solution_steps: z.array(z.object({ step_number: z.number(), description: z.string() })), final_answer: z.string(), difficulty })),
  }),
});

export const ClassMaterialSchema = z.object({
  id: z.string(), classId: z.string(), sessionId: z.string(), title: z.string(),
  source: z.enum(["ai", "upload"]), status: z.enum(["draft", "published", "hidden"]),
  fileType: z.enum(["PDF", "DOCX", "PPTX", "BEEWISE"]),
  fileSize: z.string().optional(), updatedAt: z.string(),
  hasLocalFile: z.boolean().optional(), data: AIAnalyzeResponseSchema.optional(),
});
export const PersistedMaterialsSchema = z.object({ state: z.object({ materials: z.array(ClassMaterialSchema) }), version: z.number() });
