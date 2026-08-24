import { SplitPreview } from "@/features/tutor-materials/components/SplitPreview";
import { MOCK_AI_RESPONSE } from "@/features/tutor-materials/mockData";

export const metadata = {
  title: "Bản xem trước tài liệu | BeeWise Tutor",
};

export default function PreviewPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 h-full max-h-screen">
      <SplitPreview data={MOCK_AI_RESPONSE} />
    </div>
  );
}
