import { MessageCircle } from "lucide-react";

interface TutorMobileCTAProps {
  onConnect: () => void;
  rate: string;
}

export function TutorMobileCTA({ onConnect, rate }: TutorMobileCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#cfe1fa] bg-white/95 px-4 py-3 shadow-[0_-14px_42px_-24px_rgba(40,15,145,0.35)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-[#0c0c0b]/45">
            Học phí
          </p>
          <p className="truncate text-sm font-black text-[#0c0c0b]">{rate}</p>
        </div>
        <button
          type="button"
          onClick={onConnect}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ffc500] px-5 py-3 text-sm font-black text-[#0c0c0b] shadow-lg shadow-[#905b0f]/10 active:scale-[0.99]"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Kết nối
        </button>
      </div>
    </div>
  );
}
