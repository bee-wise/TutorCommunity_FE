"use client";

import React, { useEffect, useState } from "react";
import { MagicWand, Sparkle } from "@phosphor-icons/react";

const TIPS = [
  "Mẹo: Bạn có thể chỉnh sửa nội dung bài tóm tắt nếu AI tóm tắt thiếu ý.",
  "Mẹo: Các câu hỏi trắc nghiệm được tạo dựa trên những phần học sinh hay làm sai nhất.",
  "Mẹo: BeeWise AI phân tích cả giọng nói và slide bài giảng để đưa ra tóm tắt chính xác.",
  "Mẹo: Hãy kiểm tra lại các công thức toán học (LaTeX) sau khi AI tạo xong.",
  "Mẹo: Gửi ngay tài liệu cho học sinh để các em ôn tập khi kiến thức còn mới mẻ!",
  "Sắp xong rồi, bạn chờ Beewise chút nhé",
];

export const GeneratingState = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Simulate progress bar over 10 seconds
    const duration = 10000;
    const intervalTime = 100;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 99); // max out at 99% until finished
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Rotate tips every 3 seconds
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3000);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-sm border text-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#cfe1fa]/50 to-transparent blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#cfe1fa] flex items-center justify-center mb-6 relative">
          <MagicWand
            weight="fill"
            className="text-[#280F91] text-3xl animate-pulse"
          />
          <Sparkle
            weight="fill"
            className="text-[#FFC500] text-xl absolute -top-2 -right-2 animate-bounce"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Đang phân tích bản ghi Zoom...
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          BeeWise AI đang trích xuất các ý chính và tự động tạo bài tập phù hợp
          với trình độ của học sinh.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-[#280F91] h-2 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tip with fade transition */}
        <div className="h-6">
          <p
            key={tipIndex}
            className="text-sm font-medium text-[#447353] animate-[fadeIn_0.5s_ease-in-out]"
          >
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
