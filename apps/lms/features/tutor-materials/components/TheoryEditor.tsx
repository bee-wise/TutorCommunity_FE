"use client";

import React, { useState } from "react";
import { TheorySummary } from "../types";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { PencilSimple, CheckCircle } from "@phosphor-icons/react";

interface TheoryEditorProps {
  initialData: TheorySummary;
}

export const TheoryEditor = ({ initialData }: TheoryEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<TheorySummary>(initialData);
  const [tempData, setTempData] = useState<string>(
    JSON.stringify(initialData, null, 2),
  );

  const handleSave = () => {
    try {
      const parsed = JSON.parse(tempData);
      setData(parsed);
      setIsEditing(false);
    } catch {
      alert("JSON format is invalid. Please check your syntax.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50 sticky top-0 z-10">
        <h2 className="font-bold text-[#280F91]">Tóm tắt lý thuyết</h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isEditing
              ? "bg-[#447353] text-white hover:bg-[#447353]/90"
              : "bg-white border text-gray-700 hover:bg-gray-50"
          }`}
        >
          {isEditing ? (
            <>
              <CheckCircle weight="fill" />
              Lưu thay đổi
            </>
          ) : (
            <>
              <PencilSimple weight="bold" />
              Chỉnh sửa
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <p className="text-sm text-gray-500 mb-2">
              Chỉnh sửa nội dung JSON bên dưới. Các công thức toán học cần sử
              dụng cú pháp LaTeX chuẩn.
            </p>
            <textarea
              value={tempData}
              onChange={(e) => setTempData(e.target.value)}
              className="w-full flex-1 p-4 text-sm font-mono text-gray-800 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#280F91]/20 focus:border-[#280F91] outline-none transition-all"
            />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-800">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {data.title}
            </h3>
            <p className="mb-6">
              <Latex>{data.overview}</Latex>
            </p>

            {data.prerequisites && data.prerequisites.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#447353] uppercase tracking-wider mb-2">
                  Kiến thức cần nhớ
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {data.prerequisites.map((req, idx) => (
                    <li key={idx}>
                      <Latex>{req}</Latex>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {data.key_concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-[#cfe1fa]/20 p-4 rounded-xl border border-[#cfe1fa]"
                >
                  <h4 className="text-md font-bold text-[#280F91] mb-2">
                    {concept.name}
                  </h4>
                  <p className="text-sm mb-4">
                    <Latex>{concept.explanation}</Latex>
                  </p>

                  {concept.formulas && concept.formulas.length > 0 && (
                    <div className="space-y-3">
                      {concept.formulas.map((formula, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        >
                          <div className="text-center overflow-x-auto my-2 text-lg">
                            <Latex>{`$${formula.latex}$`}</Latex>
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-3 border-t pt-2">
                            <Latex>{formula.description}</Latex>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
