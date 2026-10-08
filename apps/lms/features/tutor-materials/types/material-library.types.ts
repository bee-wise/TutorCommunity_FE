import type { Learner } from "../types";
import type { ClassKind, ClassSort, ClassStatus, MaterialClass } from "./class-materials.types";

export interface MaterialLibraryFilters {
  kind: ClassKind;
  search: string;
  status: "all" | ClassStatus;
  sort: ClassSort;
}

export interface MaterialLibraryCard {
  classInfo: MaterialClass;
  learners: readonly Learner[];
  sessionCount: number;
  materialCount: number;
  missingPublishedCount: number;
}
