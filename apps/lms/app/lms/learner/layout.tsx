import { LearnerClassTabs } from "@/features/learner-classes/components/LearnerClassTabs";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearnerClassTabs />
      {children}
    </>
  );
}
