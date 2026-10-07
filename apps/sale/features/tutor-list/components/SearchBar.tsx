"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  CircleNotchIcon,
  MicrophoneIcon,
  MicrophoneSlashIcon,
} from "@phosphor-icons/react";
import { useVoiceRecognition } from "@workspace/core/hooks/useVoiceRecognition";
import type { SearchMode } from "../data/types";
import styles from "./SearchBar.module.css";

const AI_PLACEHOLDER_EXAMPLES = [
  "Ví dụ: Gia sư Toán lớp 10, dạy online vào buổi tối",
  "Ví dụ: Tìm gia sư luyện thi IELTS 7.0+, khu vực Cầu Giấy",
  "Ví dụ: Gia sư Tiếng Anh giao tiếp cho người đi làm, 200k/buổi",
  "Ví dụ: Gia sư Hóa học 12 ôn thi THPT Quốc gia, dạy trực tiếp",
  "Ví dụ: Gia sư Lập trình Python & Scratch cho học sinh cấp 2",
  "Ví dụ: Gia sư Ngữ Văn lớp 9 luyện thi vào 10, học cuối tuần",
  "Ví dụ: Gia sư Vật lý 11 chuyên bồi dưỡng học sinh giỏi",
];

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLoadingRef = useRef(isLoading);

  const isAI = mode === "ai";

  useEffect(() => {
    if (!isAI) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % AI_PLACEHOLDER_EXAMPLES.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isAI]);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleAutoSearch = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed) {
        setQuery(trimmed);
        if (mode !== "ai") {
          onModeChange("ai");
        }
        onSearch(trimmed, "ai");
      }
    },
    [mode, onModeChange, onSearch],
  );

  const { isListening, toggleListening, isSupported } = useVoiceRecognition({
    lang: "vi-VN",
    silenceTimeoutMs: 1200,
    onResult: (text) => {
      setQuery(text);
    },
    onSpeechEnd: (finalTranscript) => {
      handleAutoSearch(finalTranscript);
    },
  });

  useEffect(() => {
    // Khi kết quả trả về (isLoading chuyển từ true sang false), dừng focus
    if (prevLoadingRef.current && !isLoading) {
      inputRef.current?.blur();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

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

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
      {/* Mode toggle pills */}
      <div
        className="grid h-14 w-full grid-cols-2 items-stretch gap-1 rounded-2xl border border-border bg-muted/50 p-1 md:inline-flex md:w-auto md:shrink-0"
        role="tablist"
        aria-label="Phương thức tìm kiếm"
      >
        <button
          type="button"
          onClick={() => switchMode("manual")}
          className={`inline-flex h-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:text-xs ${
            !isAI
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
          style={{ fontFamily: "var(--font-google-sans)" }}
          aria-selected={!isAI}
          role="tab"
          id="search-mode-manual"
        >
          <MagnifyingGlassIcon size={14} className="hidden min-[360px]:block" aria-hidden="true" />
          <span className="whitespace-nowrap">Tìm kiếm thủ công</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode("ai")}
          className={`inline-flex h-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:text-xs ${
            isAI
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/70 hover:bg-primary/5 active:scale-95"
          }`}
          style={{ fontFamily: "var(--font-google-sans)" }}
          aria-selected={isAI}
          role="tab"
          id="search-mode-ai"
        >
          {isAI ? (
            <>
              <span className="whitespace-nowrap">Tìm kiếm bằng AI</span>
            </>
          ) : (
            <span className={styles.aiTextGradient}>
              <span className="whitespace-nowrap">Tìm kiếm bằng AI</span>
            </span>
          )}
        </button>
      </div>

      {/* Search input — Glassmorphism scope: AI Search input box ✓ */}
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Tìm gia sư"
        className="flex-1 min-w-0"
      >
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            isAI
              ? `p-[1.5px] overflow-hidden bg-primary/20 ${styles.aiFrame}`
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
              className={styles.aiBorderGlow}
              aria-hidden="true"
            />
          )}

          <div
            className={`relative z-10 flex h-14 items-center gap-3 px-4 ${
              isAI
                ? `overflow-hidden rounded-[14.5px] bg-card ${styles.searchBox}`
                : "bg-background rounded-2xl"
            }`}
          >
            {isAI && (
              <>
                <span
                  className={`${styles.gradientSweep} ${isLoading ? styles.loading : ""}`}
                  aria-hidden="true"
                />
                <span className={styles.aiRevealBurst} aria-hidden="true" />
              </>
            )}
            {/* Icon prefix */}
            <div className="relative z-10 shrink-0 flex items-center justify-center">
              {isAI ? (
                <Image
                  src="/icons/AI-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
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
                isListening
                  ? "Đang lắng nghe bạn nói..."
                  : isAI
                    ? AI_PLACEHOLDER_EXAMPLES[placeholderIndex]
                    : "Tìm kiếm theo tên gia sư, môn học, chuyên môn và nhiều hơn..."
              }
              className="relative z-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground placeholder:font-semibold placeholder:text-foreground/50 outline-none"
              aria-label={isAI ? "Mô tả gia sư bạn cần" : "Nhập tên gia sư"}
              autoComplete="off"
            />

            {/* Voice Search Button */}
            {isAI && (
              <button
                type="button"
                onClick={toggleListening}
                className={`relative z-10 shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
                    : "text-foreground/40 hover:text-primary hover:bg-primary/10 active:scale-95"
                }`}
                title={
                  isListening
                    ? "Đang nghe... Bấm để dừng"
                    : "Tìm kiếm bằng giọng nói"
                }
                aria-label={
                  isListening
                    ? "Đang nghe giọng nói, bấm để dừng"
                    : "Tìm kiếm bằng giọng nói"
                }
              >
                {isListening ? (
                  <MicrophoneSlashIcon size={18} weight="fill" />
                ) : (
                  <MicrophoneIcon size={18} weight="bold" />
                )}
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!query.trim()}
              id="tutor-search-submit"
              className="relative z-10 shrink-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-3 sm:px-5 text-xs font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ fontFamily: "var(--font-nunito-family)" }}
              aria-label={isAI ? "Tìm với AI" : "Tìm kiếm"}
            >
              {isLoading && isAI ? (
                <>
                  <CircleNotchIcon
                    className="animate-spin"
                    size={14}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Đang tìm</span>
                </>
              ) : isAI ? (
                <>
                  <Image
                    src="/icons/search-ai-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="sm:hidden shrink-0"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Tìm với AI</span>
                </>
              ) : (
                <>Tìm ngay</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
