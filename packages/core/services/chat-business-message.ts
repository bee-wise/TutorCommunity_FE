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
    PAYMENT_REQUEST: "PAYMENT_REQUEST", LEARNER_PAYMENT: "PAYMENT_REQUEST", LEARNER_PAYMENTS: "PAYMENT_REQUEST", PAYMENT: "PAYMENT_REQUEST",
    CLASS_SESSION: "CLASS_SESSIONS", CLASS_SESSIONS: "CLASS_SESSIONS", SCHEDULE_CLASSES: "CLASS_SESSIONS", CLASS_SCHEDULE: "CLASS_SESSIONS", SCHEDULE: "CLASS_SESSIONS",
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
  const msgTypeUpper = message.type?.toUpperCase();
  if (msgTypeUpper === "TEXT" || msgTypeUpper === "SYSTEM") return null;

  const widget = message.widget;
  if (widget) {
    const widgetTypeUpper = widget.type?.toUpperCase() ?? "";
    const refId = widget.referenceId || message.businessReferenceId || "";
    const base = {
      referenceId: refId,
      roomId: message.chatRoomId,
      payload: parseBusinessPayload(message.businessPayload),
    };

    if (widget.trialSession) {
      return {
        ...base,
        kind: "TRIAL_SESSION",
        current: { kind: "TRIAL_SESSION", data: widget.trialSession },
      };
    }
    if (widget.classConfirmation) {
      return {
        ...base,
        kind: "CLASS_CONFIRMATION",
        current: { kind: "CLASS_CONFIRMATION", data: widget.classConfirmation },
      };
    }
    if (widget.payment) {
      return {
        ...base,
        kind: "PAYMENT_REQUEST",
        current: { kind: "PAYMENT_REQUEST", data: widget.payment },
      };
    }
    if (widget.schedule) {
      return {
        ...base,
        kind: "CLASS_SESSIONS",
        current: { kind: "CLASS_SCHEDULE", data: widget.schedule },
      };
    }

    if (widgetTypeUpper.includes("TRIAL") && widget.trialSession) {
      return { ...base, kind: "TRIAL_SESSION", current: { kind: "TRIAL_SESSION", data: widget.trialSession } };
    }
    if (widgetTypeUpper.includes("CONFIRM") && widget.classConfirmation) {
      return { ...base, kind: "CLASS_CONFIRMATION", current: { kind: "CLASS_CONFIRMATION", data: widget.classConfirmation } };
    }
    if (widgetTypeUpper.includes("PAY") && widget.payment) {
      return { ...base, kind: "PAYMENT_REQUEST", current: { kind: "PAYMENT_REQUEST", data: widget.payment } };
    }
    if ((widgetTypeUpper.includes("SCHEDULE") || widgetTypeUpper.includes("SESSION")) && widget.schedule) {
      return { ...base, kind: "CLASS_SESSIONS", current: { kind: "CLASS_SCHEDULE", data: widget.schedule } };
    }
  }

  // Fallback for legacy messages
  const legacy = toChatBusinessMessage(
    message.businessType || message.messageType,
    message.businessReferenceId,
    message.businessPayload,
  );
  return legacy ? { ...legacy, roomId: message.chatRoomId } : null;
}

export function payloadString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}
