import { MessageCircleMore } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorBioSectionProps {
  tutor: TutorProfileData;
}

export function TutorBioSection({ tutor }: TutorBioSectionProps) {
  return (
    <SectionShell
      eyebrow="Giới thiệu"
      title="Giới thiệu chi tiết"
      icon={MessageCircleMore}
    >
      <div className="max-w-3xl space-y-4">
        {tutor.introduction.map((paragraph) => (
          <p
            key={paragraph}
            className="text-[15px] leading-8 text-[#0c0c0b]/72"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
