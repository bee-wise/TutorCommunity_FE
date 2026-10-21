import { LmsClassCard } from "../../../components/LmsClassCard";
import { LmsStatusBadge } from "../../../components/LmsStatusBadge";
import { getClassKindLabel, getClassNaming, getTeachingModeLabel } from "../../../components/lms-class-naming";
import type { LearnerApiClass } from "../services/learner-classes.service";

export const learnerAction =
  "min-h-11 rounded-xl transition-all active:scale-[0.98] motion-reduce:transform-none";

export function LearnerClassStatus({
  status,
}: {
  status: string | null | undefined;
}) {
  return status === "ACTIVE" ? (
    <LmsStatusBadge status="done" label="Đang học" />
  ) : status === "COMPLETED" ? (
    <LmsStatusBadge status="cancelled" label="Đã kết thúc" />
  ) : (
    <LmsStatusBadge status="planned" label="Chưa xác định" />
  );
}

export function LearnerApiClassCard({ data }: { data: LearnerApiClass }) {
  const naming = getClassNaming(data);
  return (
    <LmsClassCard
      href={`/lms/learner/classes/${data.id}`}
      ariaLabel={`Vào lớp ${naming.subject}`}
      field={naming.field}
      kindLabel={getClassKindLabel(data.type)}
      status={<LearnerClassStatus status={data.status} />}
      subject={naming.subject}
      name={naming.name}
      level={naming.level}
      meta={[
        { label: "Buổi đã tạo", value: `${data.sessionCount} buổi` },
        { label: "Hình thức", value: getTeachingModeLabel(data.teachingMode) },
      ]}
      cta={data.status === "COMPLETED" ? "Xem lại lớp" : "Vào lớp"}
    />
  );
}
