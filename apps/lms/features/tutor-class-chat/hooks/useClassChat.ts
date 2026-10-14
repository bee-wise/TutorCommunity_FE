"use client";

import { useEffect, useRef, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { classChatService } from "@workspace/core/lms-classes/chat.service";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { useClassChatRealtime } from "@workspace/core/lms-classes/useClassChatRealtime";
import { classChatQueryKeys } from "../query-keys";
import {
  classChatMessageSchema,
  type ClassChatMessageInput,
} from "../schemas/class-chat.schema";

export function useClassChat(classId: string) {
  const overview = useLmsClassResource(
    classId,
    "chat-overview",
    (s) => classMembersService.overview(classId, s),
    { roles: ["TUTOR", "LEARNER"] },
  );
  const classInfo = overview.data;
  const actor = overview.actor;
  const queryClient = useQueryClient();
  const key = classChatQueryKeys.room(classId, actor.id);
  const history = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam, signal }) =>
      classChatService.messages(classId, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.hasMore ? (last.nextCursor ?? undefined) : undefined,
    enabled: actor.allowed && Boolean(classInfo),
    staleTime: 10_000,
    refetchInterval: 15_000,
    retry: false,
  });
  const members = useLmsClassResource(
    classId,
    "members-current",
    (s) => classMembersService.current(classId, s),
    { enabled: actor.role === "TUTOR" && Boolean(classInfo) },
  );
  useClassChatRealtime(
    actor.id,
    classId,
    actor.allowed && Boolean(classInfo) && !history.isError,
    key,
  );
  const form = useForm<ClassChatMessageInput>({
    resolver: zodResolver(classChatMessageSchema),
    defaultValues: { content: "" },
  });
  const intent = useRef<{ messageId: string; content: string } | null>(null);
  useEffect(() => {
    intent.current = null;
    form.reset({ content: "" });
  }, [classId, actor.id, form]);
  const send = useLmsClassCommand(
    classId,
    (input: { messageId: string; content: string }) =>
      classChatService.send(classId, input),
    ["TUTOR", "LEARNER"],
  );
  const messages =
    actor.allowed && !history.isError
      ? Array.from(
          new Map(
            (history.data?.pages.flatMap((p) => p.items) ?? []).map((m) => [
              m.id,
              m,
            ]),
          ).values(),
        )
          .sort(
            (a, b) =>
              Date.parse(a.createdAt) - Date.parse(b.createdAt) ||
              a.id.localeCompare(b.id),
          )
          .map((m) => ({
            ...m,
            content: m.content ?? "",
            senderRole:
              m.senderId === classInfo?.tutorId
                ? ("TUTOR" as const)
                : ("LEARNER" as const),
            senderName:
              m.senderId === actor.id
                ? "Bạn"
                : m.senderId === classInfo?.tutorId
                  ? "Gia sư"
                  : (members.data?.find(
                      (person) => person.learnerId === m.senderId,
                    )?.displayName ?? `Thành viên ${m.senderId.slice(0, 8)}`),
          }))
      : [];
  const readOnly =
    classInfo?.status !== "ACTIVE" && classInfo?.status !== "UPCOMING";
  const historyRef = useRef<HTMLDivElement>(null);
  const latestId = messages.at(-1)?.id;
  useEffect(() => {
    const container = historyRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [latestId]);
  const submit = (event?: BaseSyntheticEvent) =>
    form.handleSubmit(async (input) => {
      if (send.isPending || readOnly || history.isError || !actor.allowed)
        return;
      if (intent.current && intent.current.content !== input.content) {
        form.setError("root", {
          message:
            "Tin gửi lỗi vẫn chờ retry. Gửi lại nội dung cũ trước khi soạn tin khác.",
        });
        return;
      }
      if (!intent.current)
        intent.current = {
          messageId: crypto.randomUUID(),
          content: input.content,
        };
      try {
        await send.mutateAsync(intent.current);
        intent.current = null;
        await queryClient.invalidateQueries({ queryKey: key });
        form.reset();
      } catch {
        await overview.refetch();
        await history.refetch();
        form.setError("root", {
          message:
            "Chưa gửi được tin nhắn. Thử lại cùng nội dung để tránh gửi trùng; kiểm tra quyền/trạng thái lớp.",
        });
      }
    })(event);
  return {
    classInfo,
    room: classInfo
      ? { classId, readOnly, participants: [], messages }
      : undefined,
    actorId: actor.id,
    actorRole: actor.role,
    loading:
      overview.loading ||
      (actor.allowed && Boolean(classInfo) && history.isPending),
    error: overview.error ?? history.error,
    retry: () => {
      void overview.refetch();
      void history.refetch();
    },
    hasMore: history.hasNextPage,
    loadingOlder: history.isFetchingNextPage,
    loadOlder: () => history.fetchNextPage(),
    form,
    submit,
    sending: send.isPending || form.formState.isSubmitting,
    historyRef,
  };
}
