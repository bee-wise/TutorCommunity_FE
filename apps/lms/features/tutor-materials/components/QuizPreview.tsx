"use client";

import React, { useState } from "react";
import { QuizData, MultipleChoiceQuestion, EssayExercise } from "../types";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { CheckCircle, XCircle, Info } from "@phosphor-icons/react";

interface QuizPreviewProps {
  quiz: QuizData;
}

export const QuizPreview = ({ quiz }: QuizPreviewProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showEssaySolution, setShowEssaySolution] = useState<
    Record<number, boolean>
  >({});

  const handleSelect = (qIndex: number, optionLabel: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionLabel,
    }));
  };

  const toggleEssaySolution = (eIndex: number) => {
    setShowEssaySolution((prev) => ({
      ...prev,
      [eIndex]: !prev[eIndex],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50 sticky top-0 z-10">
        <h2 className="font-bold text-[#280F91]">
          Bài tập trắc nghiệm & tự luận
        </h2>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#280F91]/10 text-[#280F91]">
          Chế độ xem trước
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* Multiple Choice Section */}
        {quiz.multiple_choice.length > 0 && (
          <section>
            <h3 className=" font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FFC500]/20 text-[#905b0f] flex items-center justify-center text-sm font-bold">
                1
              </span>
              Phần Trắc nghiệm
            </h3>
            <div className="space-y-8">
              {quiz.multiple_choice.map(
                (q: MultipleChoiceQuestion, idx: number) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCorrect = selectedAnswers[idx] === q.correct_answer;

                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border shadow-sm"
                    >
                      <p className="font-medium text-gray-900 mb-4">
                        <span className="text-[#280F91] font-bold mr-2">
                          Câu {idx + 1}:
                        </span>
                        <Latex>{q.question}</Latex>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[idx] === opt.label;
                          let optionClass =
                            "border-gray-200 hover:border-[#280F91]/50 hover:bg-gray-50 text-gray-700";

                          if (isAnswered) {
                            if (opt.label === q.correct_answer) {
                              optionClass =
                                "border-[#447353] bg-[#447353]/10 text-[#447353] ring-1 ring-[#447353]";
                            } else if (isSelected) {
                              optionClass =
                                "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                            } else {
                              optionClass =
                                "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelect(idx, opt.label)}
                              disabled={isAnswered}
                              className={`flex items-center p-3 rounded-lg border text-left transition-all ${optionClass}`}
                            >
                              <span className="w-7 h-7 rounded-full border flex items-center justify-center mr-3 font-semibold text-sm shrink-0 bg-white">
                                {opt.label}
                              </span>
                              <span className="text-sm">
                                <Latex>{opt.content}</Latex>
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div
                          className={`mt-4 p-4 rounded-lg flex gap-3 ${isCorrect ? "bg-[#447353]/10 border border-[#447353]/20" : "bg-red-50 border border-red-100"}`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isCorrect ? (
                              <CheckCircle
                                weight="fill"
                                className="text-[#447353] text-xl"
                              />
                            ) : (
                              <XCircle
                                weight="fill"
                                className="text-red-500 text-xl"
                              />
                            )}
                          </div>
                          <div>
                            <p
                              className={`font-bold mb-1 ${isCorrect ? "text-[#447353]" : "text-red-700"}`}
                            >
                              {isCorrect
                                ? "Chính xác!"
                                : `Chưa chính xác. Đáp án đúng là ${q.correct_answer}.`}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold block mb-1">
                                Giải thích:
                              </span>
                              <Latex>{q.explanation}</Latex>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </section>
        )}

        {/* Essay Section */}
        {quiz.exercises.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FFC500]/20 text-[#905b0f] flex items-center justify-center text-sm font-bold">
                2
              </span>
              Phần Tự luận
            </h3>
            <div className="space-y-8">
              {quiz.exercises.map((ex: EssayExercise, idx: number) => {
                const isShowing = showEssaySolution[idx];

                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border shadow-sm"
                  >
                    <p className="font-medium text-gray-900 mb-4">
                      <span className="text-[#280F91] font-bold mr-2">
                        Bài {idx + 1}:
                      </span>
                      <Latex>{ex.problem}</Latex>
                    </p>

                    {!isShowing ? (
                      <button
                        onClick={() => toggleEssaySolution(idx)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#280F91] hover:text-[#280F91]/80 bg-gray-50 px-4 py-2 rounded-lg border transition-colors"
                      >
                        <Info weight="bold" />
                        Xem hướng dẫn giải
                      </button>
                    ) : (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">
                          Các bước giải:
                        </h4>
                        <ul className="space-y-3 mb-4">
                          {ex.solution_steps.map((step, sIdx) => (
                            <li
                              key={sIdx}
                              className="flex gap-3 text-sm text-gray-600"
                            >
                              <span className="font-bold text-[#447353] shrink-0">
                                B{step.step_number}:
                              </span>
                              <span>
                                <Latex>{step.description}</Latex>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-[#cfe1fa]/30 p-3 rounded-lg border border-[#cfe1fa] flex gap-2 items-center">
                          <CheckCircle
                            weight="fill"
                            className="text-[#280F91] text-lg shrink-0"
                          />
                          <p className="text-sm font-bold text-[#280F91]">
                            Kết quả:{" "}
                            <span className="font-normal">
                              <Latex>{ex.final_answer}</Latex>
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => toggleEssaySolution(idx)}
                          className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 underline"
                        >
                          Ẩn hướng dẫn giải
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
