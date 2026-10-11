import { InterviewReviewScreen } from "@/features/ai-interviews/components/InterviewReviewScreen";
export default async function ConsultantInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterviewReviewScreen id={id} role="consultant" />;
}
