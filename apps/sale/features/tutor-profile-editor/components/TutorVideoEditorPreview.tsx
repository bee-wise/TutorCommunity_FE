import { Video } from "lucide-react";
import { SectionShell } from "../../tutor-profile/components/TutorProfilePrimitives";

export function TutorVideoEditorPreview({ src }: { src: string }) {
  return (
    <SectionShell
      eyebrow="Video"
      title="Video giới thiệu"
      description="Giúp học viên hiểu cách bạn giao tiếp và tổ chức buổi học."
      icon={Video}
    >
      <div className="overflow-hidden rounded-2xl border border-[#cfe1fa] bg-black shadow-sm">
        <video src={src} controls preload="metadata" className="aspect-video w-full object-contain">
          Trình duyệt không hỗ trợ phát video.
        </video>
      </div>
    </SectionShell>
  );
}
