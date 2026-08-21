import Image from "next/image";

type BrowserFrameProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function BrowserFrame({
  title,
  children,
  className = "",
}: BrowserFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-[24px] border border-[#280f91]/12 bg-white shadow-[0_28px_80px_rgba(40,15,145,0.13)] ${className}`}
    >
      <div className="flex h-11 items-center gap-2 border-b border-[#280f91]/8 px-4">
        <span className="size-2 rounded-full bg-[#280f91]/14" />
        <span className="size-2 rounded-full bg-[#280f91]/14" />
        <span className="size-2 rounded-full bg-[#ffc500]" />
        <span className="ml-2 text-[10px] font-bold text-[#37333d]/45 sm:text-xs">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <BrowserFrame title="Tổng quan gia sư" className={className}>
      <div className="relative w-full overflow-hidden bg-[#f7f8fc]">
        <Image
          src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1787303094/%E1%BA%A2nh_ch%E1%BB%A5p_m%C3%A0n_h%C3%ACnh_2026-08-21_160717.png"
          alt="Tổng quan gia sư"
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </BrowserFrame>
  );
}

export function SchedulePreview({ className }: { className?: string }) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7"];
  return (
    <BrowserFrame title="Lịch dạy" className={className}>
      <div className="bg-[#f7f8fc] p-4 sm:p-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#17141b] sm:text-xl">
              Lịch học của bạn
            </h3>
            <p className="mt-1 text-[9px] text-[#37333d]/50 sm:text-xs">
              Theo dõi toàn bộ buổi học trong tuần
            </p>
          </div>
          <span className="rounded-lg bg-white px-3 py-2 text-[9px] font-bold text-[#280f91] sm:text-xs">
            Tháng 8
          </span>
        </div>
        <div className="mt-5 grid grid-cols-6 gap-1.5 sm:gap-2">
          {days.map((day) => (
            <p
              key={day}
              className="text-center text-[8px] font-bold text-[#37333d]/45 sm:text-[10px]"
            >
              {day}
            </p>
          ))}
        </div>
        <div className="mt-2 grid min-h-[270px] grid-cols-6 gap-1.5 sm:gap-2">
          {days.map((day, index) => (
            <div key={day} className="rounded-lg bg-white p-1.5 sm:p-2">
              {index === 1 && (
                <div className="mt-8 rounded-md bg-[#280f91] p-1.5 text-[7px] font-bold text-white sm:text-[9px]">
                  IELTS Writing
                  <br />
                  14:00
                </div>
              )}
              {index === 3 && (
                <div className="mt-20 rounded-md bg-[#ffc500] p-1.5 text-[7px] font-bold text-[#201a00] sm:text-[9px]">
                  Toán 10
                  <br />
                  18:00
                </div>
              )}
              {index === 5 && (
                <div className="mt-3 rounded-md bg-[#e7eefb] p-1.5 text-[7px] font-bold text-[#280f91] sm:text-[9px]">
                  Vật lý 11
                  <br />
                  09:00
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export function MaterialsPreview({ className }: { className?: string }) {
  const rows = [
    ["Nguyễn Minh Anh", "IELTS", "Đã xuất bản"],
    ["Trần Hoàng Nam", "Toán 10", "Bản nháp"],
    ["Lê Gia Hân", "Vật lý 11", "Chưa tạo"],
  ];
  return (
    <BrowserFrame title="Quản lý tài liệu" className={className}>
      <div className="bg-[#f7f8fc] p-4 sm:p-6">
        <h3 className="text-base font-extrabold text-[#280f91] sm:text-xl">
          Tài liệu theo buổi học
        </h3>
        <p className="mt-1 text-[9px] text-[#37333d]/50 sm:text-xs">
          Bài giảng và bài tập được lưu theo từng học viên
        </p>
        <div className="mt-5 overflow-hidden rounded-xl bg-white">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] bg-[#f1f2f6] px-3 py-3 text-[8px] font-bold text-[#37333d]/45 sm:text-[10px]">
            <span>Học viên</span>
            <span>Môn học</span>
            <span>Trạng thái</span>
          </div>
          {rows.map(([student, subject, status], index) => (
            <div
              key={student}
              className="grid grid-cols-[1.2fr_0.8fr_0.8fr] items-center border-t border-[#280f91]/7 px-3 py-4 text-[8px] sm:text-[10px]"
            >
              <span className="font-bold text-[#17141b]">{student}</span>
              <span className="text-[#37333d]/60">{subject}</span>
              <span
                className={`w-fit rounded-md px-2 py-1 font-bold ${index === 0 ? "bg-[#447353]/10 text-[#447353]" : index === 1 ? "bg-[#ffc500]/20 text-[#7a5200]" : "bg-[#f1f2f6] text-[#37333d]/55"}`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export function MessagesPreview({ className }: { className?: string }) {
  return (
    <BrowserFrame title="Tin nhắn lớp học" className={className}>
      <div className="grid min-h-[320px] grid-cols-[0.42fr_0.58fr] bg-[#f7f8fc] p-3 sm:p-5">
        <div className="rounded-l-xl border border-[#280f91]/8 bg-white p-3">
          <p className="text-[10px] font-extrabold text-[#17141b] sm:text-sm">
            Phòng trò chuyện
          </p>
          <div className="mt-4 space-y-2">
            {["Minh Anh", "Hoàng Nam", "Gia Hân"].map((name, index) => (
              <div
                key={name}
                className={`rounded-lg p-2 ${index === 0 ? "bg-[#eeeaf9]" : "bg-[#f7f8fc]"}`}
              >
                <p className="text-[8px] font-bold text-[#17141b] sm:text-[10px]">
                  {name}
                </p>
                <p className="mt-1 truncate text-[7px] text-[#37333d]/45 sm:text-[9px]">
                  Nội dung buổi học hôm nay...
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-r-xl border-y border-r border-[#280f91]/8 bg-white p-3">
          <p className="border-b border-[#280f91]/8 pb-3 text-[9px] font-extrabold text-[#17141b] sm:text-xs">
            Nguyễn Minh Anh
          </p>
          <div className="flex-1 space-y-3 pt-5">
            <div className="max-w-[80%] rounded-lg rounded-tl-none bg-[#f1f2f6] p-2 text-[7px] text-[#37333d]/65 sm:text-[9px]">
              Em đã nhận được tài liệu rồi ạ.
            </div>
            <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-[#280f91] p-2 text-[7px] text-white sm:text-[9px]">
              Buổi sau mình sẽ chữa phần bài tập nhé.
            </div>
          </div>
          <div className="h-8 rounded-lg border border-[#280f91]/10 bg-[#f7f8fc]" />
        </div>
      </div>
    </BrowserFrame>
  );
}
