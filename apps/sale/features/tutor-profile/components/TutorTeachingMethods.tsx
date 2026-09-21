import type { TutorProfileData } from "../types/mockTutorProfile";
import { SectionShell } from "./TutorProfilePrimitives";

interface TutorTeachingMethodsProps {
  tutor: TutorProfileData;
}

export function TutorTeachingMethods({ tutor }: TutorTeachingMethodsProps) {
  const methods = tutor.teachingMethods || [];

  return (
    <SectionShell
      title="Phương pháp giảng dạy"
      description="Quy trình và định hướng tiếp cận kiến thức được xây dựng theo từng học viên"
    >
      {methods.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method, index) => (
            <article
              key={`${method.title}-${index}`}
              className="flex flex-col rounded-2xl border border-[#e8edf5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#280f91]/25 hover:shadow-md hover:shadow-[#280f91]/6"
            >
              <div className="mb-3.5 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#280f91] to-[#3b17c9] text-xs font-black text-white shadow-xs">
                  {`0${index + 1}`}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#280f91]/60">
                  Bước {index + 1}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#0c0c0b]">
                {method.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0c0c0b]/65">
                {method.description}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#0c0c0b]/50">
          Chưa có thông tin phương pháp giảng dạy.
        </p>
      )}
    </SectionShell>
  );
}

