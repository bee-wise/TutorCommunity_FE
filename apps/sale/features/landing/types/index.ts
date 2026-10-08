export type PainPoint = {
  id: string;
  icon: string;
  text: string;
};

export type SolutionFeature = {
  id: string;
  title: string;
  description: string;
  variant: "primary" | "secondary" | "accent" | "neutral";
};

export type HowItWorksStep = {
  step: number;
  title: string;
  description: string;
};

export type TutorBenefit = {
  id: string;
  text: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SponsorItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  isActive?: boolean;
  order?: number;
};

