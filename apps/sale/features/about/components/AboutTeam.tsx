"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Merienda } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

// Google Font with Vietnamese cursive/handwriting support
const meriendaFont = Merienda({
  subsets: ["vietnamese", "latin"],
  weight: "400",
  display: "swap",
});

// ── Role specific & GSAP styled SVG Elements ───────────────────────────────

function SparkleSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 0L19.8 13.2L36 18L19.8 22.8L18 36L16.2 22.8L0 18L16.2 13.2L18 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FloatingHeartSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CodeBracketSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 12L6 20L14 28" />
      <path d="M26 12L34 20L26 28" />
      <path d="M22 8L18 32" strokeWidth="2.5" />
    </svg>
  );
}

function PaperPlaneSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function LightningSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  );
}

function CloudSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}

function PinwheelSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none">
      <path d="M60 60 C60 33 40 10 60 10 C80 10 60 33 60 60Z" fill="#fbbf24" />
      <path
        d="M60 60 C87 60 110 40 110 60 C110 80 87 60 60 60Z"
        fill="#a78bfa"
      />
      <path
        d="M60 60 C60 87 80 110 60 110 C40 110 60 87 60 60Z"
        fill="#f59e0b"
      />
      <path d="M60 60 C33 60 10 80 10 60 C10 40 33 60 60 60Z" fill="#8b5cf6" />
    </svg>
  );
}

// ── Team data ───────────────────────────────────────────────────────────────

const TEAM = [
  {
    id: "tuyet-huong",
    name: "Tuyết Hương",
    role: "Founder Dự Án",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291884/1.png",
    story:
      "“Mình bắt đầu BeeWise từ một trăn trở rất đỗi tự nhiên: Tại sao việc tìm kiếm một người thầy tận tâm và phù hợp lại gian nan đến thế? Mình tin rằng, khi trao đi sự chân thành và giải pháp đủ tốt, việc học sẽ trở thành hành trình tràn đầy cảm hứng.”",
    side: "left",
    number: "01",
    themeColor: "#f59e0b", // Amber
    glowColor: "rgba(245, 158, 11, 0.18)",
    badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    iconElement: <PinwheelSVG className="w-12 h-12" />,
  },
  {
    id: "nhat-huy",
    name: "Nhất Huy",
    role: "Backend Engineer",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291883/2.png",
    story:
      "“Mỗi dòng mã và hệ cơ sở dữ liệu không đơn thuần là những thuật toán khô khan. Với mình, backend vững chãi chính là lời cam kết âm thầm cho mọi kết nối của học viên và gia sư được an toàn, liền mạch và tức thì.”",
    side: "right",
    number: "02",
    themeColor: "#3b82f6", // Blue
    glowColor: "rgba(59, 130, 246, 0.18)",
    badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    iconElement: <CodeBracketSVG className="w-10 h-10 text-blue-500" />,
  },
  {
    id: "phi-yen",
    name: "Phi Yến",
    role: "Marketing Specialist",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291884/3.png",
    story:
      "“Kể câu chuyện về giáo dục cần rất nhiều sự thấu cảm. Mình ở đây để lan tỏa những giá trị thật của BeeWise đến từng góc nhỏ nơi các bạn trẻ đang tìm kiếm cơ hội học tập và bứt phá giới hạn bản thân.”",
    side: "left",
    number: "03",
    themeColor: "#ec4899", // Pink/Rose
    glowColor: "rgba(236, 72, 153, 0.18)",
    badgeBg: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    iconElement: <FloatingHeartSVG className="w-10 h-10 text-pink-500" />,
  },
  {
    id: "chi-vy",
    name: "Chí Vỹ",
    role: "Frontend Engineer",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291887/4.png",
    story:
      "“Giao diện chính là nơi cảm xúc bắt đầu. Từng chuyển động mượt mà, từng điểm chạm tinh tế mà mình tỉ mỉ xây dựng đều hướng tới một mong muốn giản đơn: bạn sẽ luôn cảm thấy thoải mái và tự tin nhất khi đồng hành cùng BeeWise.”",
    side: "right",
    number: "04",
    themeColor: "#8b5cf6", // Violet
    glowColor: "rgba(139, 92, 246, 0.18)",
    badgeBg: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    iconElement: <SparkleSVG className="w-10 h-10 text-violet-500" />,
  },
  {
    id: "thien-nhan",
    name: "Thiện Nhân",
    role: "Backend Engineer",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291883/5.png",
    story:
      "“Sự ổn định và thông minh trong từng luồng nghiệp vụ là ưu tiên cao nhất của mình. Xây dựng logic chặt chẽ để bất kỳ ai, ở bất cứ đâu, cũng đều có thể chạm tới tri thức một cách thuận tiện và minh bạch nhất.”",
    side: "left",
    number: "05",
    themeColor: "#10b981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.18)",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    iconElement: <PaperPlaneSVG className="w-10 h-10 text-emerald-500" />,
  },
  {
    id: "minh-huan",
    name: "Minh Huân",
    role: "DevOps Engineer",
    image: "https://res.cloudinary.com/xcrm6ykz/image/upload/v1787291883/6.png",
    story:
      "“Hệ thống tựa như một dòng chảy không ngừng nghỉ. Mình giữ cho từng server luôn sống khỏe, pipeline tự động và mượt mà, để nhịp cầu tri thức của BeeWise luôn thông suốt trong từng giây phút.”",
    side: "right",
    number: "06",
    themeColor: "#06b6d4", // Cyan
    glowColor: "rgba(6, 182, 212, 0.18)",
    badgeBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    iconElement: <CloudSVG className="w-10 h-10 text-cyan-500" />,
  },
] as const;

export function AboutTeam() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      TEAM.forEach((member) => {
        const block = containerRef.current?.querySelector(
          `#member-screen-${member.id}`,
        );
        if (!block) return;

        const charImg = block.querySelector(".character-image");
        const textContainer = block.querySelector(".character-text-box");
        const storyElement = block.querySelector(".character-story-text");
        const numberBg = block.querySelector(".character-number-bg");
        const decorSvg = block.querySelector(".character-decor-svg");

        const fromDirection = member.side === "left" ? -280 : 280;

        // 1. Character enters from outside screen
        gsap.from(charImg, {
          x: fromDirection,
          opacity: 0,
          scale: 0.85,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });

        // 2. Big background number subtle scale & fade
        if (numberBg) {
          gsap.from(numberBg, {
            scale: 0.6,
            opacity: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        // 3. Text container slides in from opposite direction
        gsap.from(textContainer, {
          x: -fromDirection * 0.5,
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: block,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });

        // 4. Decor SVG floating animation
        if (decorSvg) {
          gsap.to(decorSvg, {
            y: -20,
            rotation: member.side === "left" ? 18 : -18,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // 5. Typewriter handwritten text effect
        const fullStory = storyElement?.getAttribute("data-story") ?? "";
        if (storyElement && fullStory) {
          storyElement.textContent = "";
          let charIndex = 0;
          let hasTyped = false;

          ScrollTrigger.create({
            trigger: block,
            start: "top 65%",
            onEnter: () => {
              if (hasTyped) return;
              hasTyped = true;
              const typeInterval = setInterval(() => {
                if (charIndex < fullStory.length) {
                  storyElement.textContent = fullStory.slice(0, charIndex + 1);
                  charIndex++;
                } else {
                  clearInterval(typeInterval);
                }
              }, 16);
            },
            once: true,
          });
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative bg-background overflow-hidden"
      id="about-team"
    >
      {/* Intro Header */}
      <div className="pt-24 pb-12 sm:pt-32 sm:pb-16 text-center max-w-4xl mx-auto px-4">
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide mb-4">
          <LightningSVG className="w-4 h-4 text-accent" />
          Đội Ngũ Sáng Lập
        </span>
        <h2 className="font-nunito text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-primary leading-tight tracking-tight">
          Hành trình của những <br className="hidden sm:inline" />
          <span className="text-accent relative inline-block">
            người kiến tạo
            <svg
              className="absolute -bottom-2 left-0 w-full text-accent/40"
              viewBox="0 0 100 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4 C 30 0, 70 8, 100 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
        <p className="mt-6 text-foreground/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
          Mỗi thành viên là một câu chuyện, cùng chung một niềm tin bền bỉ về
          một nền giáo dục minh bạch và tràn đầy cảm hứng.
        </p>
      </div>

      {/* 6 Fullscreen Storytelling Blocks */}
      <div className="flex flex-col">
        {TEAM.map((member, index) => {
          const isRight = member.side === "right";

          return (
            <section
              key={member.id}
              id={`member-screen-${member.id}`}
              className="min-h-[100dvh] flex items-center justify-center relative py-12 sm:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden border-b border-border/20"
            >
              {/* Ambient Glow Background for character */}
              <div
                className="pointer-events-none absolute -z-10 rounded-full blur-[140px] opacity-70"
                style={{
                  backgroundColor: member.glowColor,
                  width: "clamp(300px, 45vw, 650px)",
                  height: "clamp(300px, 45vw, 650px)",
                  top: "50%",
                  left: isRight ? "70%" : "30%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Huge Background Number */}
              <div
                className="character-number-bg pointer-events-none select-none absolute font-nunito font-black text-[22vw] leading-none text-foreground/[0.03] -z-10"
                style={{
                  top: "45%",
                  left: isRight ? "10%" : "65%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {member.number}
              </div>

              {/* Main 2-Column Content Container */}
              <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* ── Character Visual Column (NO BORDER, BORDERLESS FREE FIGURE) ── */}
                <div
                  className={`character-image lg:col-span-6 flex justify-center items-end relative ${
                    isRight ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {/* Floating Themed Decorative Icon */}
                  <div
                    className={`character-decor-svg absolute z-20 pointer-events-none drop-shadow-xl ${
                      isRight ? "-top-6 -left-6" : "-top-6 -right-6"
                    }`}
                  >
                    {member.iconElement}
                  </div>

                  {/* Character Illustration without any border/card container */}
                  <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[620px] aspect-[4/5] flex items-end justify-center">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      priority={index === 0}
                      className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] filter"
                      sizes="(max-width: 640px) 340px, (max-width: 1024px) 480px, 620px"
                    />
                  </div>
                </div>

                {/* ── Story & Typography Column (HANDWRITING STYLE) ── */}
                <div
                  className={`character-text-box lg:col-span-6 flex flex-col gap-6 ${
                    isRight
                      ? "lg:order-1 lg:text-right lg:items-end"
                      : "lg:order-2 lg:text-left lg:items-start"
                  }`}
                >
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border ${member.badgeBg}`}
                    >
                      {member.role}
                    </span>
                  </div>

                  {/* Character Name */}
                  <h3 className="font-nunito text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-foreground tracking-tight leading-none">
                    {member.name}
                  </h3>

                  {/* Decorative underline */}
                  <div
                    className="h-1.5 w-24 rounded-full"
                    style={{ backgroundColor: member.themeColor }}
                  />

                  {/* Story Text in Vietnamese Handwriting Style (Merienda) */}
                  <div className="mt-2 max-w-xl">
                    <p
                      data-story={member.story}
                      className={`character-story-text ${meriendaFont.className} text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-loose text-foreground/80 font-normal tracking-wide min-h-[100px] sm:min-h-[120px]`}
                      style={{
                        fontFamily: `${meriendaFont.style.fontFamily}, 'Merienda', cursive`,
                      }}
                    >
                      {member.story}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
