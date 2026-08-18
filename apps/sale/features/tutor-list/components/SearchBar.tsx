"use client";

import { useState, useRef, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  SparkleIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import type { SearchMode } from "../data/types";

interface SearchBarProps {
  mode: SearchMode;
  currentQuery: string;
  onModeChange: (mode: SearchMode) => void;
  onSearch: (query: string, mode: SearchMode) => void;
  isLoading: boolean;
}

export function SearchBar({
  mode,
  currentQuery,
  onModeChange,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState(currentQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      onSearch(query, mode);
    },
    [query, mode, onSearch],
  );

  const switchMode = (newMode: SearchMode) => {
    onModeChange(newMode);
    inputRef.current?.focus();
  };

  const isAI = mode === "ai";

  return (
    <div className="flex flex-col gap-3">
      {/* Mode toggle pills */}
      <div
        className="inline-flex self-start items-center rounded-xl border border-border bg-muted/50 p-1 gap-1"
        role="tablist"
        aria-label="Phương thức tìm kiếm"
      >
        <button
          type="button"
          onClick={() => switchMode("manual")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
            !isAI
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
          style={{ fontFamily: "var(--font-nunito-family)" }}
          aria-selected={!isAI}
          role="tab"
          id="search-mode-manual"
        >
          <MagnifyingGlassIcon size={13} aria-hidden="true" />
          Tìm kiếm thủ công
        </button>
        <button
          type="button"
          onClick={() => switchMode("ai")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
            isAI
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
          style={{ fontFamily: "var(--font-nunito-family)" }}
          aria-selected={isAI}
          role="tab"
          id="search-mode-ai"
        >
          <SparkleIcon size={13} aria-hidden="true" />
          Tìm kiếm bằng AI
        </button>
      </div>

      {/* Search input — Glassmorphism scope: AI Search input box ✓ */}
      <form onSubmit={handleSubmit} role="search" aria-label="Tìm gia sư">
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            isAI
              ? "p-[1.5px] overflow-hidden bg-primary/20"
              : "border border-border shadow-sm"
          }`}
          style={
            isAI
              ? {
                  boxShadow:
                    "0 4px 24px var(--primary-opacity, rgba(40,15,145,0.10))",
                }
              : {}
          }
        >
          {/* AI animated conic border */}
          {isAI && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] aspect-square animate-spin pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 20%, #a855f7 35%, #3b82f6 50%, var(--primary) 65%, transparent 80%)",
                animationDuration: "4s",
              }}
              aria-hidden="true"
            />
          )}

          <div
            className={`relative z-10 flex h-14 items-center gap-3 px-4 ${
              isAI ? "rounded-[14.5px] bg-card" : "bg-background rounded-2xl"
            }`}
          >
            {/* Icon prefix */}
            <div className="shrink-0">
              {isAI ? (
                <SparkleIcon
                  size={18}
                  className="text-primary"
                  weight="duotone"
                  aria-hidden="true"
                />
              ) : (
                <MagnifyingGlassIcon
                  size={18}
                  className="text-foreground/40"
                  aria-hidden="true"
                />
              )}
            </div>

            <input
              ref={inputRef}
              type="search"
              id="tutor-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAI
                  ? "Ví dụ: Gia sư Toán lớp 10, dạy online vào buổi tối"
                  : "Tìm kiếm theo tên gia sư..."
              }
              className="flex-1 bg-transparent text-sm text-foreground placeholder-foreground/35 outline-none min-w-0"
              aria-label={isAI ? "Mô tả gia sư bạn cần" : "Nhập tên gia sư"}
              autoComplete="off"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={!query.trim()}
              id="tutor-search-submit"
              className="shrink-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ fontFamily: "var(--font-nunito-family)" }}
              aria-label={isAI ? "Tìm với AI" : "Tìm kiếm"}
            >
              {isLoading && isAI ? (
                <><CircleNotchIcon className="animate-spin" size={14} aria-hidden="true" />Đang tìm</>
              ) : isAI ? <>Tìm với AI</> : <>Tìm ngay</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
