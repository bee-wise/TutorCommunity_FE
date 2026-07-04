"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import ProfileCard from "@/src/components/ProfileCard";
import Carousel, { CarouselRef } from "@/src/components/Carousel";

const TUTORS = [
  {
    id: 1,
    avatarUrl: "/images/tutors/1.png",
    name: "Jessica Hương",
    title: "Gia sư Toán – Lý",
    handle: "tuyethuong.gv",
    status: "Oxford University",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(40, 15, 145, 0.55)",
    innerGradient:
      "linear-gradient(145deg, rgba(40,15,145,0.6) 0%, rgba(255,197,0,0.18) 100%)",
  },
  {
    id: 2,
    avatarUrl: "/images/tutors/2.png",
    name: "Huy Đỗ",
    title: "Gia sư Tiếng Anh",
    handle: "huy.do",
    status: "Trinity CertTESOL",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(68, 115, 83, 0.55)",
    innerGradient:
      "linear-gradient(145deg, rgba(68,115,83,0.5) 0%, rgba(207,225,250,0.2) 100%)",
  },
  {
    id: 3,
    avatarUrl: "/images/tutors/3.png",
    name: "Yến Trần",
    title: "Gia sư Hóa – Sinh",
    handle: "yentran.sci",
    status: "University of Glasgow",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(144, 91, 15, 0.45)",
    innerGradient:
      "linear-gradient(145deg, rgba(144,91,15,0.45) 0%, rgba(255,197,0,0.25) 100%)",
  },
  {
    id: 4,
    avatarUrl: "/images/tutors/4.png",
    name: "Vỹ Ngô",
    title: "Gia sư IELTS",
    handle: "vy.ngo",
    status: "University of London",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(40, 15, 145, 0.50)",
    innerGradient:
      "linear-gradient(145deg, rgba(60,20,160,0.55) 0%, rgba(250,220,118,0.2) 100%)",
  },
  {
    id: 5,
    avatarUrl: "/images/tutors/5.png",
    name: "Huân Nguyễn",
    title: "Gia sư Lập trình",
    handle: "huannguyen.dev",
    status: "University of California",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(68, 115, 83, 0.50)",
    innerGradient:
      "linear-gradient(145deg, rgba(40,15,145,0.4) 0%, rgba(68,115,83,0.35) 100%)",
  },
  {
    id: 6,
    avatarUrl: "/images/tutors/6.png",
    name: "Nhân Huỳnh",
    title: "Gia sư Piano",
    handle: "nhanhuynh.music",
    status: "Yamaha Music School",
    contactText: "Liên hệ",
    behindGlowColor: "rgba(144, 91, 15, 0.40)",
    innerGradient:
      "linear-gradient(145deg, rgba(255,197,0,0.3) 0%, rgba(40,15,145,0.5) 100%)",
  },
];

export function TutorCarouselSection() {
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<CarouselRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") carouselRef.current?.prev();
      if (e.key === "ArrowRight") carouselRef.current?.next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const carouselItems = useMemo(() => {
    return TUTORS.map((tutor, i) => ({
      id: tutor.id,
      component: (
        <ProfileCard
          avatarUrl={tutor.avatarUrl}
          miniAvatarUrl={tutor.avatarUrl}
          name={tutor.name}
          title={tutor.title}
          handle={tutor.handle}
          status={tutor.status}
          contactText={tutor.contactText}
          behindGlowEnabled
          behindGlowColor={tutor.behindGlowColor}
          innerGradient={tutor.innerGradient}
          enableTilt={i === activeIndex}
          showUserInfo
        />
      ),
    }));
  }, [activeIndex]);

  const Wrapper = shouldReduceMotion ? "div" : motion.section;
  const wrapperProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    // @ts-expect-error – motion.section / div union
    <Wrapper
      {...wrapperProps}
      className="relative py-20 sm:py-24 overflow-hidden bg-white"
      aria-labelledby="tutor-carousel-headline"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(40,15,145,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2
              id="tutor-carousel-headline"
              className="text-2xl sm:text-4xl text-primary leading-tight"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Kết nối với Gia Sư <span className="text-[#FFC500]">Nổi Bật</span>
            </h2>
            <p className="text-foreground/55 text-sm sm:text-base max-w-[48ch]">
              Hơn 500 gia sư đã xác thực đang chờ kết nối với bạn.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => carouselRef.current?.prev()}
              aria-label="Gia sư trước"
              className="w-10 h-10 rounded-full border border-[#dce8fb] flex items-center justify-center
                text-primary transition-all duration-200
                hover:bg-primary hover:text-white hover:border-primary"
            >
              <CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
            </button>
            <button
              onClick={() => carouselRef.current?.next()}
              aria-label="Gia sư tiếp theo"
              className="w-10 h-10 rounded-full border border-[#dce8fb] flex items-center justify-center
                text-primary transition-all duration-200
                hover:bg-primary hover:text-white hover:border-primary"
            >
              <CaretRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Carousel
          ref={carouselRef}
          items={carouselItems}
          itemWidth={260}
          gap={24}
          autoplay={true}
          autoplayDelay={3500}
          loop={true}
          pauseOnHover={true}
          onIndexChange={(index) => setActiveIndex(index)}
          onClick={setActiveIndex}
        />
      </div>

      <div
        className="flex items-center justify-center gap-2 mt-4"
        role="tablist"
        aria-label="Chọn gia sư"
      >
        {TUTORS.map((tutor, i) => (
          <button
            key={tutor.id}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Xem gia sư ${tutor.name}`}
            onClick={() => carouselRef.current?.goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              background: i === activeIndex ? "#280F91" : "rgba(40,15,145,0.2)",
            }}
          />
        ))}
      </div>
    </Wrapper>
  );
}
