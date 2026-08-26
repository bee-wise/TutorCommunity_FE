export type ProfileBlockId =
  | "basic"
  | "introduction"
  | "methods"
  | "academic"
  | "video"
  | "experience"
  | "evidence";

export interface ProfileMediaState {
  videoUrl: string;
}
