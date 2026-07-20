import React from "react";
import { MaterialsTable } from "@/features/tutor-materials/components/MaterialsTable";

export const metadata = {
  title: "Quản lý tài liệu | BeeWise Tutor",
};

export default function TutorMaterialsPage() {
  return (
    <div className="container mx-auto p-1 md:p-2 max-w-6xl">
      <MaterialsTable />
    </div>
  );
}
