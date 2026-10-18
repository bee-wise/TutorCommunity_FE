import Link from "next/link";
import type { LearnerConversation } from "../types/learner-messages.types";
import { formatConversationTime } from "../utils/learner-messages.utils";

export function ConversationListItem({
  conversation,
  selected,
}: {
  conversation: LearnerConversation;
  selected: boolean;
}) {
  const isActive = conversation.status === "ACTIVE";
  const isHighlighted = isActive && conversation.unreadCount > 0;

  return (
    <Link
      href={`/lms/learner/chat/${conversation.id}`}
      aria-current={selected ? "page" : undefined}
      className={`grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-xl px-3 py-3 transition-colors active:scale-[0.99] ${
        selected
          ? "bg-primary text-white"
          : isHighlighted
            ? "bg-muted text-foreground hover:bg-muted"
            : isActive
              ? "text-foreground hover:bg-muted"
              : "text-muted-foreground hover:bg-muted"
      }`}
    >
      <span className={`grid size-[42px] place-items-center rounded-full text-xs font-extrabold ${selected ? "bg-card/15 text-white" : isActive ? "bg-muted text-primary" : "bg-border text-muted-foreground"}`}>
        {conversation.tutor.initials}
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <strong className="truncate text-sm">{conversation.tutor.name}</strong>
          <time className={`shrink-0 text-[10px] ${selected ? "text-white/65" : "text-muted-foreground"}`}>{formatConversationTime(conversation.lastMessageAt)}</time>
        </span>
        <span className={`mt-0.5 block truncate text-xs font-semibold ${selected ? "text-white/80" : isActive ? "text-primary" : "text-muted-foreground"}`}>{conversation.className}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className={`min-w-0 flex-1 truncate text-xs ${selected ? "text-white/70" : isHighlighted ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{conversation.lastMessage}</span>
          {conversation.unreadCount > 0 ? <span className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${selected ? "bg-card text-primary" : "bg-primary text-white"}`}>{conversation.unreadCount}</span> : null}
        </span>
      </span>
    </Link>
  );
}
