import { CommunityPost, TutorApplication } from "../types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { Clock, DollarSign, Quote, CheckCircle2, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@workspace/ui/components/ui/button";
import Link from "next/link";

interface ApplicationCardProps {
  application: TutorApplication;
  post: CommunityPost;
  onAccept?: (applicationId: string) => void;
  showPostInfo?: boolean;
}

export function ApplicationCard({ application: app, post, onAccept, showPostInfo }: ApplicationCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-12 h-12 border border-slate-100">
          <AvatarImage src={app.tutor.avatarUrl || ""} />
          <AvatarFallback>
            {app.tutor.displayName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-slate-800">
                {app.tutor.displayName}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(app.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </div>
            </div>
            {app.status === "ACCEPTED" && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Đã chọn
              </span>
            )}
            {app.status === "PENDING" && (
              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Đang chờ
              </span>
            )}
          </div>
        </div>
      </div>

      {showPostInfo && (
        <div className="mb-3 px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <div className="text-xs text-slate-600">
            Ứng tuyển cho bài đăng: <span className="font-semibold text-slate-800">{post.subject}</span>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 mb-3 relative">
        <Quote className="absolute top-2 left-2 w-4 h-4 text-slate-200" />
        <p className="relative z-10 pl-5 text-sm italic">
          &quot;{app.pitchNote}&quot;
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white border border-slate-100 rounded-md p-2 flex items-center gap-2">
          <div className="bg-amber-50 p-1.5 rounded text-amber-600">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Thù lao đề xuất
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {formatCurrency(app.proposedRate)}
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-md p-2 flex items-center gap-2">
          <div className="bg-blue-50 p-1.5 rounded text-blue-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Lịch trống
            </div>
            <div
              className="text-sm font-semibold text-slate-800 truncate"
              title={app.availableSlots.join(", ")}
            >
              {app.availableSlots.length > 0
                ? app.availableSlots.join(", ")
                : "Chưa cập nhật"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/tutors/${app.tutor.id}`} className={onAccept && post.status === "OPEN" && app.status === "PENDING" ? "w-1/3" : "w-full"}>
          <Button variant="outline" className="w-full">
            Xem hồ sơ
          </Button>
        </Link>
        {onAccept && post.status === "OPEN" && app.status === "PENDING" && (
          <Button
            className="flex-1 bg-primary text-white"
            onClick={() => onAccept(app.id)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Kết nối
          </Button>
        )}
      </div>
    </div>
  );
}
