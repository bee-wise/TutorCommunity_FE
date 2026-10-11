"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  connectionWidgetsService,
  type ClassConfirmation,
  type CreateTrialSession,
} from "@workspace/core/services/connection-widgets.service";
import type { ChatTeachingOffering } from "@workspace/core/services/chat-rooms.service";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { consultantWidgetKeys } from "../queryKeys";

export type WidgetTab = "trial" | "confirmation" | "payment" | "sessions";
type TeachingMode = "ONLINE" | "OFFLINE";

export function useConsultantWidgetTools(
  roomId: string,
  teachingOfferings: ChatTeachingOffering[],
  onSent: () => void,
  initialTab: WidgetTab = "trial",
  initialConfirmationId?: string,
) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<WidgetTab>(initialTab);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedOfferingId, setSelectedOfferingId] = useState("");
  const selectedOffering = teachingOfferings.find((item) => item.id === selectedOfferingId);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("ONLINE");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  function chooseTrialStart(value: string) {
    setStartAt(value);
    const start = new Date(value);
    if (!value || Number.isNaN(start.getTime())) {
      setEndAt("");
      return;
    }
    const end = new Date(endAt);
    if (!endAt || Number.isNaN(end.getTime()) || end <= start) {
      setEndAt(new Date(start.getTime() + 60 * 60_000).toISOString());
    }
  }

  const [confirmationId, setConfirmationId] = useState(initialConfirmationId ?? "");
  const [offeringId, setOfferingId] = useState("");
  const [classMode, setClassMode] = useState<TeachingMode>("ONLINE");
  const [duration, setDuration] = useState("60");
  const [sessions, setSessions] = useState("1");
  const [schedule, setSchedule] = useState("");

  const trials = useQuery({
    queryKey: consultantWidgetKeys.trials(roomId),
    queryFn: () => connectionWidgetsService.listTrials(roomId),
    enabled: tab === "confirmation",
    refetchInterval: 15_000,
  });
  const confirmations = useQuery({
    queryKey: consultantWidgetKeys.confirmations(roomId),
    queryFn: () => connectionWidgetsService.listClassConfirmations(roomId),
    enabled: tab === "confirmation",
    refetchInterval: 15_000,
  });
  const selected: ClassConfirmation | undefined = confirmations.data?.find(
    (item) => item.id === confirmationId,
  );

  const lastPopulatedIdRef = useRef<string>("");

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialConfirmationId !== undefined) {
      setConfirmationId(initialConfirmationId);
    }
  }, [initialConfirmationId]);

  useEffect(() => {
    if (!confirmationId) {
      lastPopulatedIdRef.current = "";
      return;
    }
    if (!confirmations.data) return;
    if (lastPopulatedIdRef.current === confirmationId) return;
    const item = confirmations.data.find((candidate) => candidate.id === confirmationId);
    if (!item) return;
    setOfferingId(item.tutorOfferingId ?? "");
    setClassMode(item.teachingMode === "OFFLINE" ? "OFFLINE" : "ONLINE");
    setDuration(String(item.sessionDurationMinutes ?? 60));
    setSessions(String(item.numberOfSessions ?? 1));
    setSchedule(item.proposedSchedule ?? "");
    lastPopulatedIdRef.current = confirmationId;
  }, [confirmationId, confirmations.data]);

  const createTrialMutation = useMutation({
    mutationFn: (input: CreateTrialSession) =>
      connectionWidgetsService.createTrial(roomId, input),
  });
  const completeTrialMutation = useMutation({
    mutationFn: ({ id, version }: { id: string; version: number }) =>
      connectionWidgetsService.completeTrial(id, version),
  });
  const updateConfirmationMutation = useMutation({
    mutationFn: (input: {
      id: string;
      tutorOfferingId: string;
      teachingMode: TeachingMode;
      sessionDurationMinutes: number;
      numberOfSessions: number;
      proposedSchedule: string;
      expectedVersion: number;
    }) => {
      const { id, ...payload } = input;
      return connectionWidgetsService.updateClassConfirmation(id, payload);
    },
  });
  const busy =
    createTrialMutation.isPending ||
    completeTrialMutation.isPending ||
    updateConfirmationMutation.isPending;

  function chooseTab(value: WidgetTab) {
    setTab(value);
    setError("");
    setSuccess("");
  }

  function chooseConfirmation(id: string) {
    setConfirmationId(id);
    const item = confirmations.data?.find((candidate) => candidate.id === id);
    if (!item) return;
    setOfferingId(item.tutorOfferingId ?? "");
    setClassMode(item.teachingMode === "OFFLINE" ? "OFFLINE" : "ONLINE");
    setDuration(String(item.sessionDurationMinutes ?? 60));
    setSessions(String(item.numberOfSessions ?? 1));
    setSchedule(item.proposedSchedule ?? "");
    lastPopulatedIdRef.current = id;
  }

  async function createTrial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOffering) {
      setError("Hãy chọn tổ hợp giảng dạy của gia sư.");
      return;
    }
    if (!z.guid().safeParse(selectedOffering.id).success) {
      setError("Mã tổ hợp giảng dạy không hợp lệ. Hãy tải lại phòng chat rồi thử lại.");
      return;
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start <= new Date() ||
      end <= start
    ) {
      setError("Hãy chọn thời gian học thử trong tương lai (giờ kết thúc phải sau giờ bắt đầu).");
      return;
    }
    if (!location.trim()) {
      setError(
        teachingMode === "ONLINE"
          ? "Hãy nhập liên kết hoặc thông tin phòng học trực tuyến."
          : "Hãy nhập địa điểm học trực tiếp.",
      );
      return;
    }
    const input: CreateTrialSession = {
      tutorOfferingId: selectedOffering.id,
      scheduledStartAt: start.toISOString(),
      scheduledEndAt: end.toISOString(),
      teachingMode,
      locationOrMeetingInfo: location.trim(),
      zoomUrl:
        teachingMode === "ONLINE" && /^https?:\/\//i.test(location.trim())
          ? location.trim()
          : null,
      note: note.trim() || null,
    };
    setError("");
    setSuccess("");
    try {
      await createTrialMutation.mutateAsync(input);
      await queryClient.invalidateQueries({ queryKey: consultantWidgetKeys.trials(roomId) });
      onSent();
      setSelectedOfferingId("");
      setStartAt("");
      setEndAt("");
      setLocation("");
      setNote("");
      setSuccess("Đã gửi đề xuất học thử vào phòng chat.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    }
  }

  async function completeTrial(id: string, version: number) {
    setError("");
    setSuccess("");
    try {
      await completeTrialMutation.mutateAsync({ id, version });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: consultantWidgetKeys.trials(roomId) }),
        queryClient.invalidateQueries({ queryKey: consultantWidgetKeys.confirmations(roomId) }),
      ]);
      onSent();
      setSuccess("Đã hoàn thành học thử. Bản điều khoản lớp đã được tạo.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    }
  }

  async function updateConfirmation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || selected.version == null) return;
    const minutes = Number(duration);
    const count = Number(sessions);
    if (
      !z.guid().safeParse(offeringId.trim()).success ||
      !Number.isInteger(minutes) ||
      minutes <= 0 ||
      !Number.isInteger(count) ||
      count <= 0
    ) {
      setError("Hãy nhập mã GUID hợp lệ của gói giảng dạy, cùng thời lượng và số buổi học.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await updateConfirmationMutation.mutateAsync({
        id: selected.id,
        tutorOfferingId: offeringId.trim(),
        teachingMode: classMode,
        sessionDurationMinutes: minutes,
        numberOfSessions: count,
        proposedSchedule: schedule.trim(),
        expectedVersion: selected.version,
      });
      await queryClient.invalidateQueries({ queryKey: consultantWidgetKeys.confirmations(roomId) });
      onSent();
      setConfirmationId("");
      setSuccess("Đã cập nhật điều khoản lớp để Gia sư và Học viên xác nhận.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
      await queryClient.invalidateQueries({ queryKey: consultantWidgetKeys.confirmations(roomId) });
      setConfirmationId("");
    }
  }

  return {
    tab,
    chooseTab,
    busy,
    error,
    success,
    trial: {
      teachingOfferings, selectedOfferingId, setSelectedOfferingId,
      startAt, setStartAt: chooseTrialStart, endAt, setEndAt,
      teachingMode, setTeachingMode, location, setLocation, note, setNote, createTrial,
    },
    confirmation: {
      trials, confirmations, selected, confirmationId, chooseConfirmation,
      offeringId, setOfferingId, classMode, setClassMode,
      duration, setDuration, sessions, setSessions, schedule, setSchedule,
      completeTrial, updateConfirmation,
    },
  };
}

export type ConsultantWidgetModel = ReturnType<typeof useConsultantWidgetTools>;
