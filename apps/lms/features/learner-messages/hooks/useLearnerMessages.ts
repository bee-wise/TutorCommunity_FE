"use client";

import { useMemo, useState } from "react";
import { LEARNER_CONVERSATIONS } from "../data/learner-messages.mock";

export function useLearnerMessages() {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("all");

  const classOptions = useMemo(
    () => LEARNER_CONVERSATIONS,
    [],
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return LEARNER_CONVERSATIONS.filter((conversation) => {
      const searchableContent = `${conversation.tutor.name} ${conversation.className} ${conversation.subject}`
        .toLocaleLowerCase("vi");
      return searchableContent.includes(query) && (classId === "all" || conversation.classId === classId);
    });
  }, [classId, search]);

  const activeConversations = filteredConversations.filter((item) => item.status === "ACTIVE");
  const closedConversations = filteredConversations.filter((item) => item.status === "CLOSED");

  return {
    search,
    classId,
    classOptions,
    activeConversations,
    closedConversations,
    setSearch,
    setClassId,
  };
}
