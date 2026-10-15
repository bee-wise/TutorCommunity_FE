import { LearnerApiSessionsScreen } from "@/features/learner-classes/components/LearnerApiSessionsScreen";

export default async function Page({params}:{params:Promise<{classId:string}>}) {const {classId}=await params;return <LearnerApiSessionsScreen classId={classId}/>;}
