import { z } from "zod";
import type { ChatMessageRecord } from "./chat-rooms.service";
import type { ClassConfirmation, ClassSchedule, PaymentRequest, TrialSession } from "./connection-widgets.service";

export type ChatBusinessKind = "TRIAL_SESSION" | "CLASS_CONFIRMATION" | "PAYMENT_REQUEST" | "CLASS_SESSIONS";

export interface ChatBusinessMessage {
  kind: ChatBusinessKind;
  referenceId?: string;
  payload: Record<string, unknown>;
  roomId?: string;
  current?:
    | { kind: "TRIAL_SESSION"; data: TrialSession }
    | { kind: "CLASS_CONFIRMATION"; data: ClassConfirmation }
    | { kind: "PAYMENT_REQUEST"; data: PaymentRequest }
    | { kind: "CLASS_SCHEDULE"; data: ClassSchedule };
}

const objectSchema = z.record(z.string(), z.unknown());

export function parseBusinessPayload(value: unknown): Record<string, unknown> {
  let candidate = value;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      return {};
    }
  }
  return objectSchema.safeParse(candidate).data ?? {};
}

export function toChatBusinessMessage(
  businessType: string | null | undefined,
  businessReferenceId: string | null | undefined,
  businessPayload: unknown,
): ChatBusinessMessage | null {
  const payload = parseBusinessPayload(businessPayload);
  const normalize = (value: string) => value.trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
  const kinds: Record<string, ChatBusinessKind> = {
    TRIAL_SESSION: "TRIAL_SESSION", TRIAL_SESSIONS: "TRIAL_SESSION",
    CLASS_CONFIRMATION: "CLASS_CONFIRMATION", CLASS_CONFIRMATIONS: "CLASS_CONFIRMATION",
    PAYMENT_REQUEST: "PAYMENT_REQUEST", LEARNER_PAYMENT: "PAYMENT_REQUEST", LEARNER_PAYMENTS: "PAYMENT_REQUEST",
    CLASS_SESSION: "CLASS_SESSIONS", CLASS_SESSIONS: "CLASS_SESSIONS", SCHEDULE_CLASSES: "CLASS_SESSIONS",
  };
  const kind = [businessType, payloadString(payload, "widgetType")]
    .filter((value): value is string => typeof value === "string")
    .map((value) => kinds[normalize(value)])
    .find((value) => value !== undefined);
  if (!kind) return null;
  return {
    kind,
    referenceId: businessReferenceId ?? undefined,
    payload,
  };
}

export function toChatHistoryBusinessMessage(message: ChatMessageRecord): ChatBusinessMessage | null {
  if (message.type === "TEXT" || message.type === "SYSTEM") return null;
  if (message.type !== "WIDGET") {
    if (message.type) return null;
    const legacy = toChatBusinessMessage(
      message.businessType || message.messageType,
      message.businessReferenceId,
      message.businessPayload,
    );
    return legacy ? { ...legacy, roomId: message.chatRoomId } : null;
  }

  const widget = message.widget;
  if (!widget?.referenceId) return null;
  const base = {
    referenceId: widget.referenceId,
    roomId: message.chatRoomId,
    payload: parseBusinessPayload(message.businessPayload),
  };
  switch (widget.type) {
    case "TRIAL_SESSION":
      return widget.trialSession?.id === widget.referenceId &&
        widget.trialSession.chatRoomId === message.chatRoomId
        ? { ...base, kind: "TRIAL_SESSION", current: { kind: "TRIAL_SESSION", data: widget.trialSession } }
        : null;
    case "CLASS_CONFIRMATION":
      return widget.classConfirmation?.id === widget.referenceId &&
        widget.classConfirmation.chatRoomId === message.chatRoomId
        ? { ...base, kind: "CLASS_CONFIRMATION", current: { kind: "CLASS_CONFIRMATION", data: widget.classConfirmation } }
        : null;
    case "PAYMENT_REQUEST":
      return widget.payment?.id === widget.referenceId
        ? { ...base, kind: "PAYMENT_REQUEST", current: { kind: "PAYMENT_REQUEST", data: widget.payment } }
        : null;
    case "CLASS_SCHEDULE":
      return widget.schedule?.classId === widget.referenceId
        ? { ...base, kind: "CLASS_SESSIONS", current: { kind: "CLASS_SCHEDULE", data: widget.schedule } }
        : null;
    default:
      return null;
  }
}

export function payloadString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}
