import { use } from "react";
import { TutorDetail } from "@/features/tutors/components/TutorDetail";

export default function TutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TutorDetail tutorId={id} />;
}
