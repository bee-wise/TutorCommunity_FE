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
          ? "bg-[#280F91] text-white"
          : isHighlighted
            ? "bg-[#EEF2FF] text-slate-950 hover:bg-[#E4E9FF]"
            : isActive
              ? "text-slate-900 hover:bg-slate-50"
              : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <span className={`grid size-[42px] place-items-center rounded-full text-xs font-extrabold ${selected ? "bg-white/15 text-white" : isActive ? "bg-[#CFE1FA] text-[#280F91]" : "bg-slate-200 text-slate-600"}`}>
        {conversation.tutor.initials}
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <strong className="truncate text-sm">{conversation.tutor.name}</strong>
          <time className={`shrink-0 text-[10px] ${selected ? "text-white/65" : "text-slate-400"}`}>{formatConversationTime(conversation.lastMessageAt)}</time>
        </span>
        <span className={`mt-0.5 block truncate text-xs font-semibold ${selected ? "text-white/80" : isActive ? "text-[#280F91]" : "text-slate-500"}`}>{conversation.className}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className={`min-w-0 flex-1 truncate text-xs ${selected ? "text-white/70" : isHighlighted ? "font-semibold text-slate-700" : "text-slate-500"}`}>{conversation.lastMessage}</span>
          {conversation.unreadCount > 0 ? <span className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${selected ? "bg-white text-[#280F91]" : "bg-[#280F91] text-white"}`}>{conversation.unreadCount}</span> : null}
        </span>
      </span>
    </Link>
  );
}
