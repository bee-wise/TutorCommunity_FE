import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import type { ClassLearner } from "../types/classes.types";

export function ClassLearnerIdentity({ learner, nameId }: { learner: ClassLearner; nameId?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0 rounded-2xl border border-border" aria-hidden="true">
        {learner.avatarUrl && <AvatarImage src={learner.avatarUrl} alt="" className="object-cover" referrerPolicy="no-referrer" />}
        <AvatarFallback className="rounded-2xl bg-muted font-nunito text-xs font-extrabold text-primary">{learner.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 space-y-1">
        <p id={nameId} className="font-nunito text-sm font-extrabold leading-5 text-foreground [overflow-wrap:anywhere]">{learner.fullName}</p>
        <p className="text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">{learner.email ?? "Chưa có email"}</p>
      </div>
    </div>
  );
}
