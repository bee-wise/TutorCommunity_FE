import type { TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorBioSectionProps {
  tutor: TutorProfileData;
}

export function TutorBioSection({ tutor }: TutorBioSectionProps) {
  const introText =
    typeof tutor.introduction === "string" ? tutor.introduction : "";
  const paragraphs = introText
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SectionShell
      title="Giới thiệu bản thân"
      description="Thông tin chi tiết về năng lực, định hướng và phương châm giảng dạy"
    >
      {paragraphs.length > 0 ? (
        <div className="space-y-4 rounded-xl bg-[#f8faff] p-5 sm:p-6 border border-[#e8edf5]">
          {paragraphs.map((para, index) => (
            <p
              key={index}
              className="text-sm leading-7 text-[#0c0c0b]/80 sm:text-[15px]"
            >
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#0c0c0b]/50">
          Gia sư chưa cập nhật phần giới thiệu chi tiết.
        </p>
      )}
    </SectionShell>
  );
}

