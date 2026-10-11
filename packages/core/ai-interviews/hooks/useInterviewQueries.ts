"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { interviewKeys, type InterviewListParams } from "../queryKeys";
import { interviewApi } from "../services/interview.api";

export function useInterviewIdentity() {
  return useAuthStore((state) => state.user?.id) ?? "";
}
export function useInterviewPolicyQuery() {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.policy(userId),
    queryFn: interviewApi.getPolicy,
    enabled: Boolean(userId),
    retry: false,
  });
}
export function useInterviewEligibilityQuery() {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.eligibility(userId),
    queryFn: interviewApi.getEligibility,
    enabled: Boolean(userId),
    retry: false,
  });
}
export function useInterviewStateQuery(id: string) {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.state(userId, id),
    queryFn: () => interviewApi.getState(id),
    enabled: Boolean(userId && id),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2000,
    refetchInterval: (query) =>
      ["COMPLETED", "AI_PROCESSING", "PENDING_REVIEW"].includes(
        query.state.data?.status ?? "",
      )
        ? 10000
        : false,
  });
}
export function useInterviewListQuery(params: InterviewListParams) {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.list(userId, params),
    queryFn: ({ signal }) => interviewApi.getList(params, signal),
    enabled: Boolean(userId),
    refetchInterval: 30000,
  });
}
export function useInterviewPackageQuery(id: string) {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.package(userId, id),
    queryFn: () => interviewApi.getPackage(id),
    enabled: Boolean(userId && id),
    staleTime: 0,
    refetchInterval: 10 * 60 * 1000,
  });
}
export function useInterviewAuditQuery(entity: string, id: string) {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.audit(userId, entity, id),
    queryFn: () => interviewApi.getAudit(entity, id),
    enabled: Boolean(userId && id),
  });
}
export function useInterviewPoliciesQuery() {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.policies(userId),
    queryFn: interviewApi.getPolicies,
    enabled: Boolean(userId),
  });
}
export function useInterviewRubricsQuery() {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.rubrics(userId),
    queryFn: interviewApi.getRubrics,
    enabled: Boolean(userId),
  });
}
export function useInterviewRubricQuery(version: string) {
  const userId = useInterviewIdentity();
  return useQuery({
    queryKey: interviewKeys.rubric(userId, version),
    queryFn: () => interviewApi.getRubric(version),
    enabled: Boolean(userId && version),
  });
}
export function useInterviewMutation<T, R>(
  mutationFn: (values: T) => Promise<R>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    retry: false,
    onSuccess: () => client.invalidateQueries({ queryKey: interviewKeys.all }),
  });
}
