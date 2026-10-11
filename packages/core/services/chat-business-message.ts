import { z } from "zod";
import type { ChatMessageRecord } from "./chat-rooms.service";
import type {
  ClassConfirmation,
  ClassSchedule,
  PaymentRequest,
  TrialSession,
} from "./connection-widgets.service";

export type ChatBusinessKind =
  | "TRIAL_SESSION"
  | "CLASS_CONFIRMATION"
  | "PAYMENT_REQUEST"
  | "CLASS_SESSIONS";

export interface ChatBusinessMessage {
  kind: ChatBusinessKind;
  referenceId?: string;
  payload?: Record<string, unknown>;
  roomId?: string;
  current?:
    | { kind: "TRIAL_SESSION"; data: TrialSession }
    | { kind: "CLASS_CONFIRMATION"; data: ClassConfirmation }
    | { kind: "PAYMENT_REQUEST"; data: PaymentRequest }
    | { kind: "CLASS_SCHEDULE"; data: ClassSchedule };
}

export function isDraftWidget(status?: string | null): boolean {
  return typeof status === "string" && status.trim().toUpperCase() === "DRAFT";
}

export function isDraftWidgetMessage(
  message?: {
    type?: string | null;
    messageType?: string | null;
    businessType?: string | null;
    businessPayload?: unknown;
    widget?: unknown;
    business?: ChatBusinessMessage | null;
    isDraft?: boolean;
  } | null,
): boolean {
  if (!message) return false;
  if (message.isDraft) return true;

  if (message.widget && typeof message.widget === "object") {
    const w = message.widget as Record<string, unknown>;
    if (isDraftWidget(w.status as string | undefined)) return true;
    if (w.data && typeof w.data === "object") {
      const d = w.data as Record<string, unknown>;
      if (isDraftWidget(d.status as string | undefined)) return true;
    }
    if (w.classConfirmation && typeof w.classConfirmation === "object") {
      const c = w.classConfirmation as Record<string, unknown>;
      if (isDraftWidget(c.status as string | undefined)) return true;
    }
    if (w.trialSession && typeof w.trialSession === "object") {
      const t = w.trialSession as Record<string, unknown>;
      if (isDraftWidget(t.status as string | undefined)) return true;
    }
    if (w.payment && typeof w.payment === "object") {
      const p = w.payment as Record<string, unknown>;
      if (isDraftWidget(p.status as string | undefined)) return true;
    }
    if (w.schedule && typeof w.schedule === "object") {
      const s = w.schedule as Record<string, unknown>;
      if (isDraftWidget(s.status as string | undefined)) return true;
    }
  }

  const currentStatus = message.business?.current?.data?.status;
  if (isDraftWidget(currentStatus)) return true;

  if (message.businessPayload && typeof message.businessPayload === "object") {
    const payload = message.businessPayload as Record<string, unknown>;
    if (isDraftWidget(payload.status as string | undefined)) return true;
  }

  if (
    message.business?.payload &&
    typeof message.business.payload === "object"
  ) {
    const payload = message.business.payload as Record<string, unknown>;
    if (isDraftWidget(payload.status as string | undefined)) return true;
  }

  return false;
}

export type OfferingNameSource = {
  contextName?: string | null;
  teachingItemName?: string | null;
  subject?: string | null;
  subjectName?: string | null;
  offeringSnapshot?: unknown;
  tutorOffering?: unknown;
};

export function formatTeachingOfferingName(
  item?: OfferingNameSource | unknown,
  fallback: string = "—",
): string {
  if (!item || typeof item !== "object") return fallback;
  const source = item as OfferingNameSource;

  const extractSnapshot = (val: unknown): Record<string, unknown> | null => {
    if (!val) return null;
    if (typeof val === "object" && !Array.isArray(val))
      return val as Record<string, unknown>;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === "object")
          return parsed as Record<string, unknown>;
      } catch {
        // ignore
      }
    }
    return null;
  };

  const snapshot =
    extractSnapshot(source.offeringSnapshot) ??
    extractSnapshot(source.tutorOffering);

  const getString = (val: unknown): string | undefined => {
    return typeof val === "string" && val.trim() ? val.trim() : undefined;
  };

  const context =
    getString(source.contextName) || getString(snapshot?.contextName);
  const teachingItem =
    getString(source.teachingItemName) || getString(snapshot?.teachingItemName);

  if (context && teachingItem) {
    return `${context} - ${teachingItem}`;
  }
  if (teachingItem) {
    return teachingItem;
  }
  if (context) {
    return context;
  }

  const legacySubject =
    getString(source.subjectName) ||
    getString(source.subject) ||
    getString(snapshot?.subjectName) ||
    getString(snapshot?.subject);

  return legacySubject || fallback;
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
  businessPayload?: unknown,
): ChatBusinessMessage | null {
  const payload = parseBusinessPayload(businessPayload);
  const normalize = (value: string) =>
    value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .toUpperCase();
  const kinds: Record<string, ChatBusinessKind> = {
    TRIAL_SESSION: "TRIAL_SESSION",
    TRIAL_SESSIONS: "TRIAL_SESSION",
    CLASS_CONFIRMATION: "CLASS_CONFIRMATION",
    CLASS_CONFIRMATIONS: "CLASS_CONFIRMATION",
    PAYMENT_REQUEST: "PAYMENT_REQUEST",
    LEARNER_PAYMENT: "PAYMENT_REQUEST",
    LEARNER_PAYMENTS: "PAYMENT_REQUEST",
    PAYMENT: "PAYMENT_REQUEST",
    CLASS_SESSION: "CLASS_SESSIONS",
    CLASS_SESSIONS: "CLASS_SESSIONS",
    SCHEDULE_CLASSES: "CLASS_SESSIONS",
    CLASS_SCHEDULE: "CLASS_SESSIONS",
    SCHEDULE: "CLASS_SESSIONS",
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

export function toChatHistoryBusinessMessage(
  message: ChatMessageRecord,
): ChatBusinessMessage | null {
  const msgTypeUpper = message.type?.toUpperCase();
  if (msgTypeUpper === "TEXT" || msgTypeUpper === "SYSTEM") return null;

  const widget = message.widget;
  if (widget) {
    const widgetTypeUpper = widget.type?.toUpperCase() ?? "";
    const refId = widget.referenceId || message.businessReferenceId || "";
    const base = {
      referenceId: refId,
      roomId: message.chatRoomId,
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
      return {
        ...base,
        kind: "TRIAL_SESSION",
        current: { kind: "TRIAL_SESSION", data: widget.trialSession },
      };
    }
    if (widgetTypeUpper.includes("CONFIRM") && widget.classConfirmation) {
      return {
        ...base,
        kind: "CLASS_CONFIRMATION",
        current: { kind: "CLASS_CONFIRMATION", data: widget.classConfirmation },
      };
    }
    if (widgetTypeUpper.includes("PAY") && widget.payment) {
      return {
        ...base,
        kind: "PAYMENT_REQUEST",
        current: { kind: "PAYMENT_REQUEST", data: widget.payment },
      };
    }
    if (
      (widgetTypeUpper.includes("SCHEDULE") ||
        widgetTypeUpper.includes("SESSION")) &&
      widget.schedule
    ) {
      return {
        ...base,
        kind: "CLASS_SESSIONS",
        current: { kind: "CLASS_SCHEDULE", data: widget.schedule },
      };
    }
  }

  // Fallback for legacy messages
  const legacy = toChatBusinessMessage(
    message.businessType || message.messageType,
    message.businessReferenceId,
  );
  return legacy ? { ...legacy, roomId: message.chatRoomId } : null;
}

export function payloadString(
  payload?: Record<string, unknown>,
  key?: string,
): string | undefined {
  if (!payload || !key) return undefined;
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}
