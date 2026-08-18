"use client";

import React from "react";
import Link from "next/link";
import { MOCK_LESSONS } from "../mockData";
import { Lesson, MaterialStatus } from "../types";
import { Eye } from "@phosphor-icons/react";

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

export const MaterialsTable = () => {
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-2xl font-extrabold text-[#280F91]"
            style={{
              fontFamily: "var(--font-nunito-family), sans-serif",
            }}
          >
            Quản lý tài liệu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và tạo tài liệu học tập, bài tập cho học sinh từ bản ghi
            Zoom.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="hidden md:table-header-group bg-gray-50/50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Học sinh</th>
                <th className="px-6 py-4 whitespace-nowrap">Môn học</th>
                <th className="px-6 py-4 whitespace-nowrap">Ngày học</th>
                <th className="px-6 py-4 whitespace-nowrap">
                  Trạng thái tài liệu
                </th>
                <th className="px-6 py-4 text-right whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y flex flex-col md:table-row-group">
              {MOCK_LESSONS.map((lesson: Lesson) => (
                <tr
                  key={lesson.id}
                  className="flex flex-col md:table-row hover:bg-gray-50/50 transition-colors p-4 md:p-0"
                >
                  <td className="md:px-6 md:py-4 font-medium text-gray-900 flex items-center justify-between md:table-cell mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-gray-500 font-normal">
                      Học sinh
                    </span>
                    <span>{lesson.studentName}</span>
                  </td>
                  <td className="md:px-6 md:py-4 text-gray-600 flex items-center justify-between md:table-cell mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-gray-500 font-normal">
                      Môn học
                    </span>
                    <span>{lesson.subject}</span>
                  </td>
                  <td className="md:px-6 md:py-4 text-gray-600 flex items-center justify-between md:table-cell mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-gray-500 font-normal">
                      Ngày học
                    </span>
                    <span>{lesson.date}</span>
                  </td>
                  <td className="md:px-6 md:py-4 flex items-center justify-between md:table-cell mb-4 md:mb-0">
                    <span className="md:hidden text-xs text-gray-500 font-normal">
                      Trạng thái
                    </span>
                    <StatusBadge status={lesson.status} />
                  </td>
                  <td className="md:px-6 md:py-4 text-right md:table-cell">
                    <Link
                      href={`/lms/tutor/materials/${lesson.id}`}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white border px-3 py-2 md:py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-[#280F91] transition-all"
                    >
                      <Eye weight="bold" />
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
              {MOCK_LESSONS.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Chưa có buổi học nào cần quản lý tài liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
