"use client";

import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { ClassMissingState } from "./ClassMissingState";
import { ApiSessionList } from "./ApiSessionList";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { classPage } from "./classes-ui";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useTutorClassDetail(classId);
  if (loading) return <ClassWorkspaceSkeleton />;
  if (error) return <ClassQueryErrorState error={error} onRetry={retry} detail />;
  if (!classInfo) return <ClassMissingState />;
  return <div className={classPage}>
    <ClassWorkspaceHeader classInfo={classInfo} title={classInfo.serverDetails?.features.attendance ? "Buổi học & điểm danh" : "Buổi học"} />
    <ApiSessionList key={classId} classInfo={classInfo} />
  </div>;
}
