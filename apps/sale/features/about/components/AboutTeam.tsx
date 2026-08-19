import Image from "next/image";
import { LinkedinLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";

const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    role: "Co-founder & Product Lead",
    avatar: "VA",
    avatarBg: "bg-primary",
    bio: "Sinh viên ĐH FPT, đam mê EdTech và trải nghiệm người dùng. Chịu trách nhiệm về định hướng sản phẩm và trải nghiệm người dùng.",
    linkedin: "#",
    github: "#",
  },
  {
    id: "2",
    name: "Trần Thị B",
    role: "Co-founder & Tech Lead",
    avatar: "TB",
    avatarBg: "bg-violet-600",
    bio: "Fullstack developer với niềm đam mê xây dựng hệ thống mở rộng. Dẫn dắt kỹ thuật từ backend đến hạ tầng cloud.",
    linkedin: "#",
    github: "#",
  },
  {
    id: "3",
    name: "Lê Minh C",
    role: "AI & Data Engineer",
    avatar: "MC",
    avatarBg: "bg-emerald-600",
    bio: "Chuyên sâu về Machine Learning và xử lý ngôn ngữ tự nhiên. Xây dựng hệ thống gợi ý gia sư thông minh của BeeWise.",
    linkedin: "#",
    github: "#",
  },
  {
    id: "4",
    name: "Phạm Thu D",
    role: "Design & Brand",
    avatar: "TD",
    avatarBg: "bg-rose-500",
    bio: "UI/UX Designer với tư duy thiết kế lấy người dùng làm trung tâm. Đảm bảo mỗi màn hình đều đẹp, dễ dùng và có cảm xúc.",
    linkedin: "#",
    github: "#",
  },
];

export function AboutTeam() {
  return (
    <section
      className="py-16 sm:py-24 bg-muted/40 relative overflow-hidden"
      id="about-team"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center gap-3">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            Đội ngũ sáng lập
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-primary leading-tight font-nunito">
            Những người xây dựng <span className="text-accent">BeeWise</span>
          </h2>
          <p className="text-foreground/65 text-base sm:text-lg max-w-xl leading-relaxed">
            Một nhóm sinh viên FPT với cùng mục tiêu: làm cho việc học thêm trở
            nên minh bạch và hiệu quả hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="group flex flex-col gap-5 p-6 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${member.avatarBg} flex items-center justify-center text-white font-black text-base shrink-0 shadow-md`}
                >
                  {member.avatar}
                </div>
                <div>
                  <p className="font-bold text-base text-foreground font-nunito leading-tight">
                    {member.name}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-foreground/65 leading-relaxed flex-1">
                {member.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <a
                  href={member.linkedin}
                  className="flex items-center gap-1.5 text-xs text-foreground/55 hover:text-primary transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinLogo size={16} weight="fill" />
                  LinkedIn
                </a>
                <a
                  href={member.github}
                  className="flex items-center gap-1.5 text-xs text-foreground/55 hover:text-foreground transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo size={16} weight="fill" />
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
