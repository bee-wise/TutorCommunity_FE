import type { ChatBusinessMessage } from "./chat-business-message";

type TrialCurrent = Extract<NonNullable<ChatBusinessMessage["current"]>, { kind: "TRIAL_SESSION" }>;

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
