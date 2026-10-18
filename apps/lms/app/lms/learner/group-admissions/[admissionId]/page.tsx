import { LearnerAdmissionScreen } from "@/features/group-admissions/components/LearnerGroupAdmissionsScreen";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ admissionId: string }>;
  searchParams: Promise<{ paymentId?: string | string[] }>;
}) {
  const { admissionId } = await params,
    { paymentId } = await searchParams;
  return (
    <LearnerAdmissionScreen
      admissionId={admissionId}
      paymentId={typeof paymentId === "string" ? paymentId : undefined}
    />
  );
}
