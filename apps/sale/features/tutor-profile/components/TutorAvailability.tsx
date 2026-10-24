import type { TutorProfileData } from "../types/tutor.type";
import { SectionShell } from "./TutorProfilePrimitives";

export function TutorAvailabilityList({
  availability,
}: {
  availability: TutorProfileData["availability"];
}) {
  return (
    <ul className="space-y-2">
      {availability.map((slot, index) => (
        <li
          key={`${slot.day}-${slot.time}-${index}`}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted px-3 py-2.5 text-sm"
        >
          <span className="font-bold text-foreground">{slot.day}</span>
          <span className="whitespace-nowrap tabular-nums text-muted-foreground">
            {slot.time}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Mobile-only section; on desktop the same data lives in the connect card. */
export function TutorAvailability({ tutor }: { tutor: TutorProfileData }) {
  const availability = tutor.availability ?? [];
  if (availability.length === 0) return null;

  return (
    <SectionShell
      id="lich-ray"
      title="Lịch có thể nhận lớp"
      className="lg:hidden"
    >
      <TutorAvailabilityList availability={availability} />
    </SectionShell>
  );
}
