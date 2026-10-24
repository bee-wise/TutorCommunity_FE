import type { TutorClassCardModel } from "../types/classes.types";
import { TutorClassCard } from "./TutorClassCard";

const grid = "grid gap-4 md:grid-cols-2 xl:grid-cols-3";
const isPublic = (card: TutorClassCardModel) => card.classInfo.serverDetails?.approvalStatus === "APPROVED";

function Group({ title, cards }: { title: string; cards: TutorClassCardModel[] }) {
  return (
    <section aria-label={title} className="space-y-4">
      <h3 className="font-lms text-base font-extrabold text-foreground">
        {title} <span className="tabular-nums text-muted-foreground">({cards.length})</span>
      </h3>
      <div className={grid}>
        {cards.map((card) => <TutorClassCard key={card.classInfo.id} {...card} />)}
      </div>
    </section>
  );
}

// Group classes: approved (public) classes first, the rest below a divider.
export function ClassCardGroups({ cards, grouped }: { cards: TutorClassCardModel[]; grouped: boolean }) {
  if (!grouped)
    return <div className={grid}>{cards.map((card) => <TutorClassCard key={card.classInfo.id} {...card} />)}</div>;
  const approved = cards.filter(isPublic);
  const others = cards.filter((card) => !isPublic(card));
  return (
    <div className="space-y-6">
      {approved.length > 0 && <Group title="Lớp đang công khai" cards={approved} />}
      {approved.length > 0 && others.length > 0 && <hr className="border-border" />}
      {others.length > 0 && <Group title="Lớp chưa công khai" cards={others} />}
    </div>
  );
}
