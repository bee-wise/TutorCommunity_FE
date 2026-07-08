import { BrainCircuit, ClipboardCheck, Compass, Target } from "lucide-react";
import type { TutorProfileData } from "../data/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorTeachingMethodsProps {
  tutor: TutorProfileData;
}

export function TutorTeachingMethods({ tutor }: TutorTeachingMethodsProps) {
  const icons = [BrainCircuit, Compass, ClipboardCheck];

  return (
    <SectionShell
      eyebrow="Phương pháp"
      title="Lộ trình học có đo lường"
      icon={Target}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {tutor.teachingMethods.map((method, index) => {
          const Icon = icons[index % icons.length];

          return (
            <article
              key={method.title}
              className="rounded-2xl border border-[#cfe1fa] bg-[#fff3cb]/38 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-[#280f91]/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#280f91] shadow-sm">
                <Icon size={19} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-black text-[#0c0c0b]">
                {method.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#0c0c0b]/65">
                {method.description}
              </p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
