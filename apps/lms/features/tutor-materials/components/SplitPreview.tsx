"use client";

import React, { useState } from "react";
import { TheoryEditor } from "./TheoryEditor";
import { QuizPreview } from "./QuizPreview";
import { AIAnalyzeResponse } from "../types";
import { Check, CloudArrowUp } from "@phosphor-icons/react";

interface SplitPreviewProps {
  data: AIAnalyzeResponse;
}

export const SplitPreview = ({ data }: SplitPreviewProps) => {
  const [activeTab, setActiveTab] = useState<"theory" | "quiz">("theory");
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublished(true);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1 shrink-0">
        <div className="flex p-1 bg-gray-100 rounded-lg shrink-0 w-full sm:w-1/4 ">
          <button
            onClick={() => setActiveTab("theory")}
            className={`flex-1 sm:px-2 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === "theory"
                ? "bg-white text-[#280F91] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tóm tắt lý thuyết
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 sm:px-2 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === "quiz"
                ? "bg-white text-[#280F91] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bài tập
          </button>
        </div>

        <button
          onClick={handlePublish}
          disabled={isPublishing || published}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all shadow-sm ${
            published
              ? "bg-[#447353] text-white cursor-default"
              : "bg-[#280F91] text-white hover:bg-[#280F91]/90 focus:ring-4 focus:ring-[#280F91]/20"
          }`}
        >
          {isPublishing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang lưu...
            </>
          ) : published ? (
            <>
              <Check weight="bold" className="text-lg" />
              Đã xuất bản tài liệu
            </>
          ) : (
            <>
              <CloudArrowUp weight="fill" className="text-lg text-white" />
              Lưu & Xuất bản cho học viên
            </>
          )}
        </button>
      </div>

      {/* Tabs */}

      <div className="flex-1 overflow-hidden">
        {/* Tab View */}
        <div className="h-full flex flex-col gap-6">
          <div
            className={`h-full flex-1 min-h-0 ${activeTab === "theory" ? "block" : "hidden"}`}
          >
            <TheoryEditor initialData={data.summary} />
          </div>

          <div
            className={`h-full flex-1 min-h-0 ${activeTab === "quiz" ? "block" : "hidden"}`}
          >
            <QuizPreview quiz={data.quiz} />
          </div>
        </div>
      </div>
    </div>
  );
};
