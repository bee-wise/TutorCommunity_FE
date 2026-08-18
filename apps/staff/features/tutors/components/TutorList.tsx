"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { mockTutors, TutorStatus } from "@/features/tutors/mocks/tutors.mock";
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export default function TutorsListPage() {
  const [filterStatus, setFilterStatus] = useState<TutorStatus | "ALL">("ALL");

  const filteredTutors = mockTutors.filter(
    (t) => filterStatus === "ALL" || t.status === filterStatus
  );

  const getStatusBadge = (status: TutorStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Chờ duyệt
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" /> Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" /> Đã từ chối
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-nunito">Duyệt Hồ Sơ Gia Sư</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách các gia sư đã hoàn thành phỏng vấn và đang chờ xác thực hồ sơ.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              filterStatus === status
                ? "text-[#280f91] bg-[#280f91]/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status === "ALL" && "Tất cả"}
            {status === "PENDING" && "Chờ duyệt"}
            {status === "APPROVED" && "Đã duyệt"}
            {status === "REJECTED" && "Từ chối"}
            {filterStatus === status && (
              <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[#280f91]" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Gia sư</th>
                <th className="px-6 py-4">Môn đăng ký</th>
                <th className="px-6 py-4">Ngày nộp</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTutors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy hồ sơ nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredTutors.map((tutor) => (
                  <tr key={tutor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tutor.avatar}
                          alt={tutor.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{tutor.name}</p>
                          <p className="text-xs text-gray-500">{tutor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tutor.teachingPreferences.subjects.slice(0, 2).map((sub) => (
                          <span
                            key={sub}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {sub}
                          </span>
                        ))}
                        {tutor.teachingPreferences.subjects.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            +{tutor.teachingPreferences.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(tutor.submittedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(tutor.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/consultant/tutors/${tutor.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-[#280f91]/10 hover:text-[#280f91] transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
