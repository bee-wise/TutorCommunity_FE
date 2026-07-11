import { TutorApprovedRoute } from "@/features/tutor-approved/tutor-approved.route";
export default async function Page({params}:{params:Promise<{chatRoomId:string}>}){const {chatRoomId}=await params;return <TutorApprovedRoute screen="chat-room" chatRoomId={chatRoomId}/>}
