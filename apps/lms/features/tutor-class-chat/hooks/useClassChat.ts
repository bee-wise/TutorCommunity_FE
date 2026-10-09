"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTutorClassDetail } from "../../tutor-classes/hooks/useTutorClassDetail";
import { classChatQueryKeys } from "../query-keys";
import { classChatMockService } from "../services/class-chat.mock.service";
import { classChatMessageSchema, type ClassChatMessageInput } from "../schemas/class-chat.schema";

export function useClassChat(classId: string) {
  const { classInfo } = useTutorClassDetail(classId);
  const queryClient = useQueryClient();
  const history = useQuery({ queryKey: classChatQueryKeys.room(classId), enabled: Boolean(classInfo),
    queryFn: () => classChatMockService.getRoom(classId), staleTime: 30_000, retry: false });
  const form = useForm<ClassChatMessageInput>({ resolver: zodResolver(classChatMessageSchema), defaultValues: { content: "" } });
  const send = useMutation({ mutationFn: (input: ClassChatMessageInput) => classChatMockService.sendMessage(classId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classChatQueryKeys.room(classId) }) });
  const historyRef = useRef<HTMLDivElement>(null);
  const latestId = history.data?.messages.at(-1)?.id;
  useEffect(() => {
    const container = historyRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [latestId]);
  const submit = form.handleSubmit(async (input) => {
    if (send.isPending || classInfo?.status === "completed") return;
    try { await send.mutateAsync(input); form.reset(); }
    catch (error: unknown) { form.setError("root", { message: error instanceof Error ? error.message : "Chưa gửi được tin nhắn. Hãy thử lại." }); }
  });
  return { classInfo, room: history.data, loading: history.isPending, error: history.error,
    retry: () => history.refetch(), form, submit, sending: send.isPending || form.formState.isSubmitting, historyRef };
}
