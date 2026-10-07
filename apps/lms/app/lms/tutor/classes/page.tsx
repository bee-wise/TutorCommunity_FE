import type { Metadata } from "next";
import { TutorClassesScreen } from "@/features/tutor-classes/components/TutorClassesScreen";

export const metadata: Metadata = { title: "Quản lý lớp học | BeeWise LMS", description: "Quản lý lớp 1:1, lớp nhóm và điểm danh buổi học." };
export default function Page() { return <TutorClassesScreen />; }
