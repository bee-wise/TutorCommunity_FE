import { UserIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import type { LearnerApiClass } from "../services/learner-classes.service";

type TutorIdentity = Pick<
  LearnerApiClass,
  "tutorId" | "tutorName" | "tutorAvatarUrl"
>;

export function LearnerClassTutorIdentity({ tutor }: { tutor: TutorIdentity }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3.5">
      <Avatar
        className="size-12 shrink-0 rounded-2xl border border-border bg-card"
        aria-hidden="true"
      >
        <AvatarImage
          src={safeExternalUrl(tutor.tutorAvatarUrl) ?? undefined}
          alt=""
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <AvatarFallback className="rounded-2xl bg-muted text-primary">
          <UserIcon className="size-6" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-lms text-sm font-extrabold text-foreground [overflow-wrap:anywhere]">
          {tutor.tutorName?.trim() || "Chưa có tên gia sư"}
        </p>
      </div>
    </div>
  );
}
