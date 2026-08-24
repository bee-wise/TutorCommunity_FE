import type { LearnerMessage } from "../types/learner-messages.types";
import { formatMessageTime } from "../utils/learner-messages.utils";

export function LearnerMessageBubble({ message }: { message: LearnerMessage }) {
  if (message.sender === "SYSTEM") {
    return <div className="py-3 text-center"><span className="inline-block max-w-[90%] rounded-full bg-[#FFF3CB] px-3 py-1.5 text-xs leading-5 text-[#805512]">{message.text}</span></div>;
  }

  const isMine = message.sender === "LEARNER";
  return (
    <article className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[82%] sm:max-w-[70%]">
        <p className={`mb-1 px-1 text-xs font-semibold ${isMine ? "text-right text-[#280F91]" : "text-slate-500"}`}>{isMine ? "Bạn" : message.senderName}</p>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${isMine ? "rounded-br-sm bg-[#280F91] text-white" : "rounded-bl-sm border border-border bg-white text-slate-800"}`}>{message.text}</div>
        <time className={`mt-1 block px-1 text-[10px] text-slate-400 ${isMine ? "text-right" : "text-left"}`}>{formatMessageTime(message.sentAt)}</time>
      </div>
    </article>
  );
}
