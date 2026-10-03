import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import {
  LegalDocument,
  type LegalSection,
} from "@/features/legal/components/LegalDocument";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Trang thông tin minh họa về quyền riêng tư và dữ liệu cá nhân trên BeeWise.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "tong-quan",
    title: "Tổng quan",
    paragraphs: [
      "BeeWise là nền tảng kết nối học viên và gia sư. Trang này phác thảo cách thông tin có thể được sử dụng khi bạn tìm gia sư, tạo hồ sơ hoặc trao đổi trên nền tảng.",
      "Các nội dung dưới đây chỉ phục vụ thiết kế giao diện và sẽ được rà soát, thay thế bằng chính sách chính thức trước khi áp dụng.",
    ],
  },
  {
    id: "thong-tin",
    title: "Thông tin liên quan đến tài khoản",
    paragraphs: [
      "Tùy theo cách bạn sử dụng BeeWise, thông tin trên nền tảng có thể gồm dữ liệu tài khoản, hồ sơ học tập hoặc giảng dạy, nội dung trao đổi và thông tin cần thiết để hỗ trợ dịch vụ.",
    ],
    bullets: [
      "Thông tin bạn chủ động cung cấp khi đăng ký và hoàn thiện hồ sơ.",
      "Nội dung bạn tạo khi tìm gia sư, liên hệ hoặc tham gia hoạt động trên BeeWise.",
      "Dữ liệu kỹ thuật cơ bản giúp vận hành, bảo vệ và cải thiện trải nghiệm.",
    ],
  },
  {
    id: "muc-dich",
    title: "Mục đích sử dụng",
    paragraphs: [
      "Thông tin có thể được dùng để vận hành tài khoản, kết nối nhu cầu học tập với gia sư phù hợp, hỗ trợ người dùng và duy trì chất lượng, độ an toàn của nền tảng.",
      "Những cách sử dụng cụ thể, phạm vi xử lý và cơ sở áp dụng sẽ được mô tả trong văn bản chính thức.",
    ],
  },
  {
    id: "chia-se",
    title: "Hiển thị và chia sẻ thông tin",
    paragraphs: [
      "Một số thông tin hồ sơ có thể được hiển thị cho người dùng khác để hỗ trợ việc tìm kiếm và kết nối. Cách hiển thị phụ thuộc vào vai trò, tính năng và lựa chọn của bạn trên nền tảng.",
      "BeeWise sẽ nêu rõ các trường hợp liên quan đến đối tác cung cấp dịch vụ hoặc yêu cầu hợp lệ trong chính sách chính thức.",
    ],
  },
  {
    id: "bao-ve",
    title: "Lưu trữ và bảo vệ dữ liệu",
    paragraphs: [
      "BeeWise hướng đến việc áp dụng các biện pháp phù hợp để quản lý quyền truy cập và bảo vệ thông tin trong quá trình vận hành. Thời gian lưu trữ và quy trình xử lý dữ liệu sẽ được công bố trong văn bản chính thức.",
    ],
  },
  {
    id: "lien-he",
    title: "Lựa chọn và liên hệ",
    paragraphs: [
      "Bạn có thể xem và cập nhật các thông tin được hỗ trợ trong tài khoản của mình. Nếu có câu hỏi về quyền riêng tư hoặc muốn trao đổi về dữ liệu cá nhân, hãy liên hệ đội ngũ BeeWise qua địa chỉ hỗ trợ ở cuối trang.",
      "Khi chính sách chính thức được ban hành hoặc cập nhật, phiên bản áp dụng sẽ được hiển thị rõ trên trang này.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <LegalDocument
        kind="privacy"
        title="Chính sách bảo mật"
        description="Cách BeeWise tiếp cận quyền riêng tư và thông tin của bạn, được trình bày rõ ràng để dễ theo dõi."
        sections={sections}
      />
      <Footer />
    </div>
  );
}
