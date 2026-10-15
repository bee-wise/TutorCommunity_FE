import { LearnerAdmissionScreen } from "@/features/group-admissions/components/LearnerGroupAdmissionsScreen";

export default async function Page({params}:{params:Promise<{admissionId:string}>}) {const {admissionId}=await params;return <LearnerAdmissionScreen admissionId={admissionId}/>;}
