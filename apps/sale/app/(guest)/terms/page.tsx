import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import {
  LegalDocument,
  type LegalSection,
} from "@/features/legal/components/LegalDocument";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Trang thông tin minh họa về việc sử dụng nền tảng BeeWise.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "gioi-thieu",
    title: "Giới thiệu",
    paragraphs: [
      "BeeWise là nền tảng kết nối học viên và gia sư. Chúng tôi mong muốn tạo ra một không gian học tập an toàn, hiệu quả và minh bạch. Các điều khoản này được xây dựng nhằm đảm bảo quyền lợi cho cả hai bên, đồng thời duy trì chất lượng dịch vụ.",
    ],
  },
  {
    id: "tai-khoan",
    title: "Tài khoản và hồ sơ",
    paragraphs: [
      "Người dùng cần cung cấp thông tin phù hợp với vai trò và giữ thông tin tài khoản được cập nhật. Hồ sơ học viên hoặc gia sư nên phản ánh chính xác nhu cầu học tập, kinh nghiệm và nội dung giảng dạy.",
    ],
    bullets: [
      "Sử dụng tài khoản của mình một cách có trách nhiệm.",
      "Kiểm tra thông tin trước khi công khai hồ sơ hoặc gửi yêu cầu kết nối.",
      "Liên hệ BeeWise khi cần hỗ trợ về tài khoản hoặc nội dung hồ sơ.",
    ],
  },
  {
    id: "ket-noi",
    title: "Kết nối và trao đổi",
    paragraphs: [
      "Các công cụ tìm kiếm, nhắn tin và kết nối được thiết kế để hỗ trợ học viên và gia sư trao đổi nhu cầu, lịch học và hình thức học. Hai bên nên giao tiếp rõ ràng, tôn trọng và xác nhận các thông tin quan trọng trước khi bắt đầu học.",
    ],
  },
  {
    id: "lop-hoc",
    title: "Lớp học và thanh toán",
    paragraphs: [
      "Khi có lớp học hoặc dịch vụ trả phí, các thông tin như học phí, lịch học, phương thức thanh toán và các điều kiện liên quan cần được thể hiện trong luồng xác nhận tương ứng.",
      "Quy tắc cụ thể về thanh toán, thay đổi lịch và xử lý vấn đề phát sinh sẽ được trình bày trong điều khoản chính thức hoặc tài liệu áp dụng cho từng dịch vụ.",
    ],
  },
  {
    id: "su-dung-phu-hop",
    title: "Sử dụng nền tảng phù hợp",
    paragraphs: [
      "BeeWise mong muốn một môi trường học tập an toàn và hữu ích. Người dùng nên tránh đăng nội dung sai lệch, xâm phạm quyền của người khác, gây phiền nhiễu hoặc can thiệp vào hoạt động bình thường của nền tảng.",
    ],
  },
  {
    id: "cap-nhat",
    title: "Cập nhật và hỗ trợ",
    paragraphs: [
      "BeeWise sẽ hiển thị điều khoản chính thức và thông tin về phiên bản áp dụng trên trang này khi sẵn sàng. Nếu cần làm rõ nội dung hoặc muốn gửi góp ý, bạn có thể liên hệ đội ngũ hỗ trợ qua thông tin ở cuối trang.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <LegalDocument
        kind="terms"
        title="Điều khoản sử dụng"
        description="Những nguyên tắc chung giúp học viên và gia sư có trải nghiệm rõ ràng, tin cậy trên BeeWise."
        sections={sections}
      />
      <Footer />
    </div>
  );
}
