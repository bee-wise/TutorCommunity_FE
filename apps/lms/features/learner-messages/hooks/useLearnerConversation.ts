"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  LEARNER_CONVERSATIONS,
  LEARNER_MESSAGES,
} from "../data/learner-messages.mock";
import type { LearnerMessage } from "../types/learner-messages.types";

export function useLearnerConversation(conversationId: string) {
  const conversation = useMemo(
    () => LEARNER_CONVERSATIONS.find((item) => item.id === conversationId),
    [conversationId],
  );
  const [messages, setMessages] = useState<LearnerMessage[]>(
    () => LEARNER_MESSAGES[conversationId] ?? [],
  );
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text || conversation?.status !== "ACTIVE") return;

    setSending(true);
    const newMessage: LearnerMessage = {
      id: `learner-message-${Date.now()}`,
      conversationId,
      sender: "LEARNER",
      senderName: "Bạn",
      text,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((current) => [...current, newMessage]);
    setSending(false);

    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    });
  }, [conversation?.status, conversationId]);

  return {
    conversation,
    messages,
    sending,
    messagesContainerRef,
    sendMessage,
  };
}
