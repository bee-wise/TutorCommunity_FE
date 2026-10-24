import {
  AcademicCapIcon,
  ComputerDesktopIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type {
  TutorProfileData,
  TutorTeachingOfferingItem,
} from "../types/tutor.type";
import { SectionShell } from "./TutorProfilePrimitives";

const MODE_LABELS: Record<string, string> = {
  ONLINE: "Online",
  OFFLINE: "Tại nhà",
  HOME: "Tại nhà",
  BOTH: "Online & tại nhà",
  HYBRID: "Online & tại nhà",
};

function offeringTitle(offering: TutorTeachingOfferingItem) {
  const item =
    offering.teachingItemName ||
    offering.proposal?.teachingItemName ||
    offering.programName;
  const context = offering.contextName || offering.proposal?.contextName;
  return { item: item || "Nội dung dạy", context: context || null };
}

function ModeIcon({ mode }: { mode?: string }) {
  const Icon =
    mode === "ONLINE"
      ? ComputerDesktopIcon
      : mode === "OFFLINE" || mode === "HOME"
        ? HomeIcon
        : AcademicCapIcon;
  return <Icon className="size-4" aria-hidden="true" />;
}

export function TutorOfferings({ tutor }: { tutor: TutorProfileData }) {
  const offerings = tutor.teachingOfferings ?? [];
  const specializations = tutor.specializations ?? [];
  if (offerings.length === 0 && specializations.length === 0) return null;

  return (
    <SectionShell id="mon-day" title="Môn dạy và học phí">
      {offerings.length > 0 ? (
        <ul className="divide-y divide-border rounded-2xl border border-border">
          {offerings.map((offering, index) => {
            const { item, context } = offeringTitle(offering);
            const mode = offering.teachingMode?.toUpperCase();
            return (
              <li
                key={offering.id || `${item}-${index}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="font-bold text-foreground">
                    {context ?? item}
                    {context ? (
                      <span className="text-muted-foreground"> · {item}</span>
                    ) : null}
                  </p>
                  {mode ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <ModeIcon mode={mode} />
                      {MODE_LABELS[mode] ?? offering.teachingMode}
                    </p>
                  ) : null}
                </div>
                {typeof offering.basePrice === "number" &&
                offering.basePrice > 0 ? (
                  <p className="text-lg font-black tabular-nums text-primary">
                    {offering.basePrice.toLocaleString("vi-VN")}đ
                    <span className="text-xs font-semibold text-muted-foreground">
                      /giờ
                    </span>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {specializations.length > 0 ? (
        <div className={offerings.length > 0 ? "mt-5" : undefined}>
          <h3 className="text-sm font-extrabold text-foreground">
            Phù hợp với
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <li
                key={spec}
                className="rounded-full border border-accent bg-accent px-3.5 py-1.5 text-xs font-bold text-accent-foreground"
              >
                {spec}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </SectionShell>
  );
}
