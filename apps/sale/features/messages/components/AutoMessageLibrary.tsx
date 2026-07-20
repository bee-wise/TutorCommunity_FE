"use client";

import { useState } from "react";
import {
  Zap,
  ClipboardList,
  X,
  Search,
} from "lucide-react";
import type { AutoMessageTemplate, TemplateCategory } from "../types/messages.types";
import { mockAutoMessageTemplates } from "../constants/messages.fixtures";

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  GREETING: "Chào hỏi",
  SCHEDULE: "Lịch học",
  CONFIRM: "Xác nhận",
  CLOSE: "Đóng kết nối",
  GENERAL: "Chung",
};

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  GREETING: "bg-[#cfe1fa] text-[#280f91]",
  SCHEDULE: "bg-amber-100 text-amber-800",
  CONFIRM: "bg-green-100 text-[#447353]",
  CLOSE: "bg-red-100 text-red-700",
  GENERAL: "bg-gray-100 text-gray-700",
};

interface AutoMessageLibraryProps {
  onSelect: (text: string) => void;
  onClose: () => void;
  learnerName?: string;
  tutorName?: string;
  subject?: string;
}

function interpolate(
  template: string,
  vars: { learnerName?: string; tutorName?: string; subject?: string }
) {
  return template
    .replace("{learnerName}", vars.learnerName ?? "học viên")
    .replace("{tutorName}", vars.tutorName ?? "gia sư")
    .replace("{subject}", vars.subject ?? "môn học");
}

export function AutoMessageLibrary({
  onSelect,
  onClose,
  learnerName,
  tutorName,
  subject,
}: AutoMessageLibraryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "ALL">("ALL");

  const filtered = mockAutoMessageTemplates.filter((t) => {
    const matchCat = activeCategory === "ALL" || t.category === activeCategory;
    const matchQ = query === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.content.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const categories: Array<TemplateCategory | "ALL"> = ["ALL", "GREETING", "SCHEDULE", "CONFIRM", "CLOSE", "GENERAL"];

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-[#e5eaf5] bg-white shadow-[0_12px_40px_rgba(40,15,145,0.12)] z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f3f9] px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#ffc500] fill-[#ffc500]" />
          <span className="text-sm font-bold text-[#280f91]">Kho tin nhắn tự động</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-[#667085] transition hover:bg-[#f0f3f9] hover:text-[#0c0c0b]"
          aria-label="Đóng kho tin nhắn"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-[#f0f3f9] px-4 py-2.5">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm mẫu tin nhắn..."
            className="w-full rounded-xl border border-[#e5eaf5] bg-[#f7f9ff] py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/20"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#f0f3f9] px-4 py-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition ${
              activeCategory === cat
                ? "bg-[#280f91] text-white"
                : "bg-[#f0f3f9] text-[#667085] hover:bg-[#e5eaf5]"
            }`}
          >
            {cat === "ALL" ? "Tất cả" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Template list */}
      <div className="max-h-64 overflow-y-auto overscroll-contain">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[#667085]">
            Không tìm thấy mẫu tin nhắn phù hợp
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filtered.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onSelect={onSelect}
                learnerName={learnerName}
                tutorName={tutorName}
                subject={subject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onSelect,
  learnerName,
  tutorName,
  subject,
}: {
  template: AutoMessageTemplate;
  onSelect: (text: string) => void;
  learnerName?: string;
  tutorName?: string;
  subject?: string;
}) {
  const interpolated = interpolate(template.content, { learnerName, tutorName, subject });

  return (
    <button
      type="button"
      onClick={() => onSelect(interpolated)}
      className="group flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-[#f7f9ff]"
    >
      <ClipboardList
        size={16}
        className="mt-0.5 shrink-0 text-[#280f91] opacity-60 group-hover:opacity-100"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold text-[#0c0c0b]">{template.title}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[template.category]}`}
          >
            {CATEGORY_LABELS[template.category]}
          </span>
        </div>
        <p className="line-clamp-2 text-xs text-[#667085]">{interpolated}</p>
      </div>
    </button>
  );
}
