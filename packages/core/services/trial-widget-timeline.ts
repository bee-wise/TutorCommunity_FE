import type { ChatBusinessMessage } from "./chat-business-message";

type TrialCurrent = Extract<NonNullable<ChatBusinessMessage["current"]>, { kind: "TRIAL_SESSION" }>;
type ConfirmationCurrent = Extract<NonNullable<ChatBusinessMessage["current"]>, { kind: "CLASS_CONFIRMATION" }>;

interface TrialTimelineMessage {
  id: string;
  business?: ChatBusinessMessage | null;
}

function trialKey(message: TrialTimelineMessage): string | null {
  const business = message.business;
  if (business?.kind !== "TRIAL_SESSION" || !business.referenceId) return null;
  return `${business.roomId ?? ""}:TRIAL_SESSION:${business.referenceId}`;
}

/** Projects all loaded events into one trial card without changing the paginated history. */
export function selectTrialWidgetTimelineMessages<T extends TrialTimelineMessage>(
  messages: readonly T[],
  isConsultantMessage: (message: T) => boolean,
): T[] {
  const anchors = new Map<string, T>();
  const currentStates = new Map<string, TrialCurrent>();

  for (const message of messages) {
    const key = trialKey(message);
    if (!key) continue;

    const anchor = anchors.get(key);
    if (!anchor || (isConsultantMessage(message) && !isConsultantMessage(anchor))) {
      anchors.set(key, message);
    }

    const current = message.business?.current;
    if (current?.kind === "TRIAL_SESSION") {
      const previous = currentStates.get(key);
      if (!previous || (current.data.version ?? -1) >= (previous.data.version ?? -1)) {
        currentStates.set(key, current);
      }
    }
  }

  return messages.flatMap((message) => {
    const key = trialKey(message);
    if (!key) return [message];
    if (anchors.get(key)?.id !== message.id) return [];

    const current = currentStates.get(key);
    if (!current || !message.business || message.business.current === current) return [message];
    return [{ ...message, business: { ...message.business, current } } as T];
  });
}

function confirmationKey(message: TrialTimelineMessage): string | null {
  const business = message.business;
  if (business?.kind !== "CLASS_CONFIRMATION") return null;
  const payloadId = business.payload?.id;
  const id = business.referenceId?.trim() ||
    (business.current?.kind === "CLASS_CONFIRMATION" ? business.current.data.id : undefined) ||
    (typeof payloadId === "string" ? payloadId.trim() : "");
  return id ? `${business.roomId ?? ""}:CLASS_CONFIRMATION:${id}` : null;
}

/** Shows one confirmation card at the newest loaded consultant event for its ID. */
export function selectClassConfirmationTimelineMessages<T extends TrialTimelineMessage>(
  messages: readonly T[],
  isConsultantMessage: (message: T) => boolean,
): T[] {
  const anchors = new Map<string, T>();
  const currentStates = new Map<string, ConfirmationCurrent>();

  for (const message of messages) {
    const key = confirmationKey(message);
    if (!key) continue;

    const anchor = anchors.get(key);
    if (!anchor || isConsultantMessage(message) || !isConsultantMessage(anchor)) {
      anchors.set(key, message);
    }

    const current = message.business?.current;
    if (current?.kind === "CLASS_CONFIRMATION") {
      const previous = currentStates.get(key);
      if (!previous || (current.data.version ?? -1) >= (previous.data.version ?? -1)) {
        currentStates.set(key, current);
      }
    }
  }

  return messages.flatMap((message) => {
    const key = confirmationKey(message);
    if (!key) return [message];
    if (anchors.get(key)?.id !== message.id) return [];

    const current = currentStates.get(key);
    if (!current || !message.business || message.business.current === current) return [message];
    return [{ ...message, business: { ...message.business, current } } as T];
  });
}

type ScheduleCurrent = Extract<NonNullable<ChatBusinessMessage["current"]>, { kind: "CLASS_SCHEDULE" }>;

function scheduleKey(message: TrialTimelineMessage): string | null {
  const business = message.business;
  if (business?.kind !== "CLASS_SESSIONS") return null;
  const classId =
    business.referenceId?.trim() ||
    (business.current?.kind === "CLASS_SCHEDULE" ? business.current.data.classId?.trim() : "");
  return classId ? `${business.roomId ?? ""}:CLASS_SESSIONS:${classId}` : null;
}

/**
 * Shows one schedule card per class, at its newest loaded event, with the newest known
 * schedule content (so repeated "sessions updated" events never stack duplicate cards).
 */
export function selectClassScheduleTimelineMessages<T extends TrialTimelineMessage>(
  messages: readonly T[],
): T[] {
  const anchors = new Map<string, T>();
  const currentStates = new Map<string, ScheduleCurrent>();

  for (const message of messages) {
    const key = scheduleKey(message);
    if (!key) continue;
    anchors.set(key, message);
    const current = message.business?.current;
    if (current?.kind === "CLASS_SCHEDULE") currentStates.set(key, current);
  }

  return messages.flatMap((message) => {
    const key = scheduleKey(message);
    if (!key) return [message];
    if (anchors.get(key)?.id !== message.id) return [];

    const current = currentStates.get(key);
    if (!current || !message.business || message.business.current === current) return [message];
    return [{ ...message, business: { ...message.business, current } } as T];
  });
}

export function selectChatWidgetTimelineMessages<T extends TrialTimelineMessage>(
  messages: readonly T[],
  isConsultantMessage: (message: T) => boolean,
): T[] {
  return selectClassScheduleTimelineMessages(
    selectClassConfirmationTimelineMessages(
      selectTrialWidgetTimelineMessages(messages, isConsultantMessage),
      isConsultantMessage,
    ),
  );
}
