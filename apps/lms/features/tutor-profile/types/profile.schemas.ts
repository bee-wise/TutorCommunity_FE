import { z } from "zod";

const text = z.string().nullish().transform((value) => value ?? "");
const list = <T extends z.ZodType>(item: T) => z.array(item).nullish().transform((value) => value ?? []);

export const tutorProfileSchema = z.object({
  id: z.string(), displayName: text, avatarUrl: text, headline: text,
  shortIntro: text, introduction: text, university: text, major: text,
  studentYear: text, area: text, experienceYears: text,
  hourlyRate: z.number().nonnegative().nullish(),
  teachingModes: list(z.string()), specializations: list(z.string()),
  availability: list(z.object({ day: text, time: text })),
  teachingOfferings: list(z.object({
    id: z.string(), programName: text, teachingItemName: text, contextName: text,
    teachingMode: text, basePrice: z.number().nonnegative().nullish(), status: text,
  })),
  teachingMethods: list(z.object({ title: text, description: text })),
  achievements: list(z.object({ title: text, type: text, description: text, status: text })),
});

export type TutorProfile = z.infer<typeof tutorProfileSchema>;
