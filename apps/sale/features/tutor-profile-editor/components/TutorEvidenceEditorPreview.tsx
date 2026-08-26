import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { CertificateItem } from "../../tutor-profile/types/mockTutorProfile";
import { SectionShell } from "../../tutor-profile/components/TutorProfilePrimitives";
import { isLocalPreviewUrl } from "../utils/file-preview";

export function TutorEvidenceEditorPreview({ certificates }: { certificates: CertificateItem[] }) {
  return (
    <SectionShell eyebrow="Minh chứng" title="Bằng cấp và thành tích" icon={BadgeCheck}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {certificates.map((item, index) => (
          <article key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-[#cfe1fa] bg-white">
            <div className="relative aspect-[4/3] border-b border-[#cfe1fa] bg-[#fff3cb]/35">
              <Image
                src={item.imageUrl ?? "/images/TutorEvidence/certi-1.png"}
                alt={item.title}
                fill
                unoptimized={isLocalPreviewUrl(item.imageUrl ?? "")}
                sizes="(min-width: 1280px) 260px, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-3"
              />
            </div>
            <div className="grid gap-2 p-4">
              <h3 className="font-extrabold leading-6 text-[#17142f]">{item.title}</h3>
              <dl className="grid gap-2 text-sm">
                <div>
                  <dt className="text-xs font-bold text-[#716c83]">Loại</dt>
                  <dd className="mt-0.5 text-[#17142f]">{item.type}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-[#716c83]">Trạng thái</dt>
                  <dd className="mt-0.5 font-bold text-[#447353]">{item.status ?? "Đã xác minh"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-[#716c83]">Mô tả công khai</dt>
                  <dd className="mt-0.5 leading-6 text-[#56516a]">{item.description}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
