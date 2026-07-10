import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { SectionShell } from "./TutorProfilePrimitives";

interface EvidenceItem {
  title: string;
  imageUrl: string;
}

const evidenceItems: EvidenceItem[] = [
  {
    title: "Giải Ba học sinh giỏi Toán",
    imageUrl: "/images/TutorEvidence/certi-1.png",
  },
  {
    title: "Giấy chứng nhận học sinh giỏi cấp tỉnh",
    imageUrl: "/images/TutorEvidence/certi-2.png",
  },
  {
    title: "Minh chứng hoạt động học thuật",
    imageUrl: "/images/TutorEvidence/certi-3.png",
  },
];

export function TutorCertificates() {
  return (
    <SectionShell
      eyebrow="Minh chứng"
      title="Bằng cấp và thành tích"
      icon={BadgeCheck}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {evidenceItems.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-[#cfe1fa] bg-white shadow-[0_14px_36px_-30px_rgba(40,15,145,0.22)] transition hover:-translate-y-0.5 hover:border-[#280f91]/20 hover:shadow-[0_18px_42px_-30px_rgba(40,15,145,0.32)]"
          >
            <a
              href={item.imageUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Xem minh chứng: ${item.title}`}
              className="group relative block aspect-[4/3] border-b border-[#cfe1fa] bg-[#fff3cb]/35 outline-none transition focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
              />
            </a>

            <div className="p-4">
              <h3 className="text-base font-medium leading-7 text-[#0c0c0b]">
                {item.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
