import { z } from "zod";

export type ChatBusinessKind = "TRIAL_SESSION" | "CLASS_CONFIRMATION" | "PAYMENT_REQUEST" | "CLASS_SESSIONS";

export interface ChatBusinessMessage {
  kind: ChatBusinessKind;
  referenceId?: string;
  payload: Record<string, unknown>;
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

export function payloadString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}
