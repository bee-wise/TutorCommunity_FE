import type { ClassSessionFilters, LearnerClassSessionStatus, LearnerMaterialFileType, LearnerMaterialSource, SessionMaterialAvailability, SessionMaterialFilters } from "../types/learner-materials.types";
import { LibrarySearch, LibrarySelect } from "./LibraryFilterControls";
import { libraryPanel } from "./learner-materials-ui";

const STATUS_OPTIONS: readonly { value: "all" | LearnerClassSessionStatus; label: string }[] = [
  { value: "all", label: "Mọi trạng thái" }, { value: "COMPLETED", label: "Đã hoàn thành" }, { value: "UPCOMING", label: "Sắp diễn ra" }, { value: "CANCELED", label: "Đã hủy" },
];
const AVAILABILITY_OPTIONS: readonly { value: SessionMaterialAvailability; label: string }[] = [
  { value: "all", label: "Mọi tình trạng" }, { value: "available", label: "Đã có tài liệu" }, { value: "empty", label: "Chưa có tài liệu" },
];
const SOURCE_OPTIONS: readonly { value: "all" | LearnerMaterialSource; label: string }[] = [
  { value: "all", label: "Mọi nguồn" }, { value: "ai", label: "Tạo bằng AI" }, { value: "upload", label: "Gia sư tải lên" },
];
const FILE_OPTIONS: readonly { value: "all" | LearnerMaterialFileType; label: string }[] = [
  { value: "all", label: "Mọi loại tệp" }, { value: "BEEWISE", label: "BeeWise" }, { value: "PDF", label: "PDF" }, { value: "DOCX", label: "DOCX" }, { value: "PPTX", label: "PPTX" },
];

export function SessionLibraryFilters({ filters, onChange }: { filters: ClassSessionFilters; onChange: (patch: Partial<ClassSessionFilters>) => void }) {
  return (
    <section className={libraryPanel} aria-label="Bộ lọc buổi học">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="md:col-span-2 xl:col-span-1"><LibrarySearch id="session-search" label="Tìm buổi học" value={filters.search} placeholder="Chủ đề hoặc số buổi học..." onChange={(search) => onChange({ search })} /></div>
        <LibrarySelect id="session-status" label="Trạng thái buổi học" value={filters.status} options={STATUS_OPTIONS} onChange={(status) => onChange({ status })} />
        <LibrarySelect id="session-availability" label="Tình trạng tài liệu" value={filters.availability} options={AVAILABILITY_OPTIONS} onChange={(availability) => onChange({ availability })} />
      </div>
    </section>
  );
}

export function SharedLibraryFilters({ filters, onChange }: { filters: SessionMaterialFilters; onChange: (patch: Partial<SessionMaterialFilters>) => void }) {
  return (
    <section className={libraryPanel} aria-label="Bộ lọc tài liệu">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="md:col-span-2 xl:col-span-1"><LibrarySearch id="material-search" label="Tìm tài liệu" value={filters.search} placeholder="Tên hoặc nội dung tài liệu..." onChange={(search) => onChange({ search })} /></div>
        <LibrarySelect id="material-source" label="Nguồn tài liệu" value={filters.source} options={SOURCE_OPTIONS} onChange={(source) => onChange({ source })} />
        <LibrarySelect id="material-file-type" label="Loại tệp" value={filters.fileType} options={FILE_OPTIONS} onChange={(fileType) => onChange({ fileType })} />
      </div>
    </section>
  );
}
