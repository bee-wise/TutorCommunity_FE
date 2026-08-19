import {
  Eye,
  Rocket,
  Heart,
  ShieldCheck,
  Handshake,
  Lightbulb,
} from "@phosphor-icons/react/dist/ssr";

const MISSION_VALUES = [
  {
    id: "transparency",
    icon: Eye,
    title: "Minh bạch",
    desc: "Mọi thông tin về gia sư, học phí và quy trình đều được công khai rõ ràng. Không có chi phí ẩn, không có bất ngờ.",
    color: "text-blue-600 bg-blue-500/10 border-blue-200",
  },
  {
    id: "quality",
    icon: ShieldCheck,
    title: "Chất lượng",
    desc: "Mỗi gia sư đều trải qua quy trình xác thực năng lực nghiêm ngặt trước khi được kết nối với học viên.",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-200",
  },
  {
    id: "trust",
    icon: Handshake,
    title: "Tin tưởng",
    desc: "Chúng tôi đứng ra làm cầu nối đáng tin cậy, bảo vệ quyền lợi bình đẳng cho cả gia sư lẫn học viên.",
    color: "text-violet-600 bg-violet-500/10 border-violet-200",
  },
  {
    id: "impact",
    icon: Rocket,
    title: "Tác động thực",
    desc: "Mỗi lớp học kết nối đúng chỗ là một bước tiến trong hành trình học tập. Đó là lý do BeeWise tồn tại.",
    color: "text-amber-600 bg-amber-500/10 border-amber-200",
  },
  {
    id: "community",
    icon: Heart,
    title: "Cộng đồng",
    desc: "BeeWise không chỉ là nền tảng — đây là cộng đồng của những người học và người dạy có trách nhiệm.",
    color: "text-rose-600 bg-rose-500/10 border-rose-200",
  },
  {
    id: "innovation",
    icon: Lightbulb,
    title: "Đổi mới",
    desc: "Ứng dụng AI không phải để thay thế con người, mà để giúp mỗi người tìm được đúng người đồng hành.",
    color: "text-teal-600 bg-teal-500/10 border-teal-200",
  },
];

export function AboutMission() {
  return (
    <section className="py-16 sm:py-24 bg-background" id="about-mission">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            Sứ mệnh
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-primary leading-tight font-nunito mb-6">
            Chúng tôi muốn làm gì?
          </h2>
          <p className="text-foreground/65 text-base sm:text-xl leading-relaxed">
            BeeWise hướng đến việc xây dựng một hệ sinh thái giáo dục minh bạch,
            nơi mọi học viên đều có thể tìm được gia sư phù hợp và mọi gia sư
            tâm huyết đều được ghi nhận xứng đáng — không phân biệt khu vực hay
            điều kiện kinh tế.
          </p>
        </div>

        {/* Values Grid */}
        <div>
          <h3 className="text-center text-xl sm:text-2xl font-bold text-foreground/70 font-nunito mb-10">
            Những giá trị cốt lõi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MISSION_VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.id}
                  className="group p-6 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${v.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={24} weight="fill" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground font-nunito leading-snug mb-1.5">
                        {v.title}
                      </h4>
                      <p className="text-sm text-foreground/65 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
