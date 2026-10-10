export interface UnreadMessage {
  senderId: string;
  createdAt: string;
  isSystem?: boolean;
  type?: string | null;
  messageType?: string | null;
}

const SYSTEM_SENDER_ID = "00000000-0000-0000-0000-000000000000";

export function countUnreadMessages(
  messages: readonly UnreadMessage[],
  readAt: string,
  viewerId: string,
): number {
  const cutoff = Date.parse(readAt);
  if (!viewerId || !Number.isFinite(cutoff)) return 0;

  return messages.filter((message) =>
    Boolean(message.senderId) &&
    message.senderId !== viewerId &&
    message.senderId !== SYSTEM_SENDER_ID &&
    !message.isSystem &&
    message.type?.toUpperCase() !== "SYSTEM" &&
    message.messageType?.toUpperCase() !== "SYSTEM" &&
    Date.parse(message.createdAt) > cutoff,
  ).length;
}
