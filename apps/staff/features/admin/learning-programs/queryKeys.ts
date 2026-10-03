export const learningProgramQueryKeys = {
  all: ["admin", "learning-programs"] as const,
  programTypes: () => [...learningProgramQueryKeys.all, "program-types"] as const,
  activeProgramTypes: () => [...learningProgramQueryKeys.all, "active-program-types"] as const,
  programs: () => [...learningProgramQueryKeys.all, "programs"] as const,
  teachingItems: () => [...learningProgramQueryKeys.all, "teaching-items"] as const,
  versions: (programId: string) => [...learningProgramQueryKeys.all, programId, "versions"] as const,
  resources: (versionId: string, resource: "contexts" | "mappings") =>
    [...learningProgramQueryKeys.all, versionId, resource] as const,
};
