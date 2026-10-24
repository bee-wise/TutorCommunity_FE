import type { ComponentType } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  GlobeAltIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { nameKey } from "./classes.utils";

export type ProgramTheme = {
  /** Background and text colors of the program panel, from design tokens only. */
  panel: string;
  /** Pill used for the context name inside the card, matching the panel color. */
  pill: string;
  Icon: ComponentType<{ className?: string }>;
};

const THEMES: Array<{ key: string; theme: ProgramTheme }> = [
  {
    key: "viet nam",
    theme: { panel: "bg-primary text-primary-foreground", pill: "bg-primary text-primary-foreground", Icon: BookOpenIcon },
  },
  {
    key: "ngoai ngu",
    theme: { panel: "bg-accent text-accent-foreground", pill: "bg-accent text-accent-foreground", Icon: LanguageIcon },
  },
  {
    key: "chuong trinh quoc te",
    theme: { panel: "bg-ring text-primary-foreground", pill: "bg-ring text-primary-foreground", Icon: GlobeAltIcon },
  },
];

// Any program outside the three main ones.
const FALLBACK_THEME: ProgramTheme = {
  panel: "bg-muted text-primary",
  pill: "bg-muted text-primary",
  Icon: AcademicCapIcon,
};

export function getProgramTheme(programName?: string | null): ProgramTheme {
  const key = nameKey(programName);
  return THEMES.find((entry) => entry.key === key)?.theme ?? FALLBACK_THEME;
}
