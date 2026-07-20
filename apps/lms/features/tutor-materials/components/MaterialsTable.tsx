'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_LESSONS } from '../mockData';
import { Lesson, MaterialStatus } from '../types';
import { Eye } from '@phosphor-icons/react';

const StatusBadge = ({ status }: { status: MaterialStatus }) => {
  switch (status) {
    case 'Published':
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#447353]/10 text-[#447353]">Đã xuất bản</span>;
    case 'Drafting':
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#ffc500]/20 text-[#905b0f]">Bản nháp</span>;
    case 'Not Generated':
    default:
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">Chưa tạo</span>;
  }
};

export const MaterialsTable = () => {
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#280F91]" style={{ fontFamily: 'var(--font-montserrat, Montserrat), sans-serif' }}>Quản lý tài liệu</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và tạo tài liệu học tập, bài tập cho học sinh từ bản ghi Zoom.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Học sinh</th>
                <th className="px-6 py-4">Môn học</th>
                <th className="px-6 py-4">Ngày học</th>
                <th className="px-6 py-4">Trạng thái tài liệu</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_LESSONS.map((lesson: Lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lesson.studentName}</td>
                  <td className="px-6 py-4 text-gray-600">{lesson.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{lesson.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lesson.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/lms/tutor/materials/${lesson.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-[#280F91] transition-all"
                    >
                      <Eye weight="bold" />
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
              {MOCK_LESSONS.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
