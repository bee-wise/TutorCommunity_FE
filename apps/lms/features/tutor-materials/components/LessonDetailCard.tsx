"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lesson, MaterialStatus } from "../types";
import {
  ArrowLeft,
  MagicWand,
  FileText,
  DownloadSimple,
} from "@phosphor-icons/react";

const StatusBadge = ({ status }: { status: MaterialStatus }) => {
  switch (status) {
    case "Published":
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#447353]/10 text-[#447353]">
          Đã xuất bản
        </span>
      );
    case "Drafting":
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#ffc500]/20 text-[#905b0f]">
          Bản nháp
        </span>
      );
    case "Not Generated":
    default:
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
          Chưa tạo
        </span>
      );
  }
};

interface LessonDetailCardProps {
  lesson: Lesson;
  onGenerate: (data: {
    transcript: string;
    subject: string;
    num_questions: number;
  }) => void;
  isGenerating: boolean;
}

export const LessonDetailCard = ({
  lesson,
  onGenerate,
  isGenerating,
}: LessonDetailCardProps) => {
  const [transcript, setTranscript] = useState(
    "Nơi em sẽ học về phương pháp cộng đại số nha\nĐầu tiên ờ chúng ta sẽ học về\nXuất phát số bằng cách là đầu tiên chúng ta sẽ đặt hẹn phương trình lần lượt là một và hai, ha\nCái\ncộng thì số lại á\nHoặc trường hay mấy phương trời một chúng ta sẽ\nTrước tiên đã ngay\nRồi ha,\nChúng tôi sẽ có được một phương trình chúng ta giải quyết trình đó thì chúng ta sẽ tìm được ít.\nThật\nCó thể vào để mà tìm nếu mà có ý thiệp tìm biết\nVà chúng ta sẽ\nCó kết quả và kết luận vậy thì hành hương trình nó có nghiện ít là bao nhiêu đây là bao nhiêu",
  );

  const handleGenerate = () => {
    onGenerate({
      transcript,
      subject: "Toán học", // using the user's mock value
      num_questions: 4, // using the user's mock value
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="shrink-0 mb-4">
        <Link
          href="/lms/tutor/materials"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#280F91] transition-colors"
        >
          <ArrowLeft weight="bold" />
          Quay lại danh sách
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Lẽft Side: Chi tiết buổi học */}
        <div className="w-full md:w-1/3 flex flex-col bg-white rounded-2xl border shadow-sm p-6 overflow-y-auto shrink-0 h-full">
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <h1
                className="text-2xl font-extrabold text-[#280F91] mb-2"
                style={{
                  fontFamily: "var(--font-montserrat, Montserrat), sans-serif",
                }}
              >
                Chi tiết buổi học
              </h1>
              <p className="text-gray-600 text-sm">
                Kiểm tra thông tin và tạo tài liệu học tập từ bản ghi hình Zoom.
              </p>
            </div>
            <div>
              <StatusBadge status={lesson.status} />
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Học sinh</p>
              <p className="font-semibold text-gray-900 text-sm">{lesson.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Môn học & Chủ đề</p>
              <p className="font-semibold text-gray-900 text-sm">{lesson.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Ngày học</p>
              <p className="font-semibold text-gray-900 text-sm">{lesson.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nguồn dữ liệu</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                Bản ghi Zoom đã sẵn sàng
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Transcript & Actions */}
        <div className="w-full md:w-2/3 flex flex-col bg-white rounded-2xl border shadow-sm p-6 overflow-hidden h-full">
          <div className="shrink-0 mb-4">
            <label
              htmlFor="transcript"
              className="block text-base font-bold text-gray-900 mb-1"
            >
              Nội dung từ buổi học Zoom (Transcript)
            </label>
            <p className="text-sm text-gray-500">
              Bạn có thể chỉnh sửa nội dung trước khi gửi cho AI phân tích để có
              kết quả chính xác hơn.
            </p>
          </div>

          <div className="flex-1 min-h-0 relative">
            <textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="absolute inset-0 w-full h-full p-4 text-sm text-gray-800 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#280F91]/20 focus:border-[#280F91] outline-none transition-all resize-none"
              placeholder="Nội dung buổi học từ Zoom sẽ hiển thị ở đây..."
            />
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-gray-100 pt-5 mt-5">
            {lesson.status !== "Not Generated" ? (
              <Link
                href={`/lms/tutor/materials/${lesson.id}/preview`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                <FileText weight="fill" className="text-gray-400" />
                Xem bản lưu
              </Link>
            ) : null}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#280F91] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#280F91]/90 focus:ring-4 focus:ring-[#280F91]/20 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
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
                  Đang khởi tạo AI...
                </>
              ) : (
                <>
                  <MagicWand weight="fill" className="text-[#FFC500]" />
                  Tạo tài liệu bài học (AI)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
