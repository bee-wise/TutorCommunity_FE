"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import ProfileCard from "@/src/components/ProfileCard";

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
    status: "MA in TESOL, Trinity CertTESOL",
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
    title: "Gia sư Sử Ielts",
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
    status: "University of California, Irvine",
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
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const CARD_GAP = 24;

  const scrollToIndex = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return;
    const trackCenter = track.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    track.scrollTo({ left: cardCenter - trackCenter, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(TUTORS.length - 1, idx));
      setActiveIndex(clamped);
      scrollToIndex(clamped);
    },
    [scrollToIndex],
  );

  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(
    () => goTo(activeIndex === 0 ? TUTORS.length - 1 : activeIndex - 1),
    [activeIndex, goTo],
  );
  const next = useCallback(
    () => goTo(activeIndex === TUTORS.length - 1 ? 0 : activeIndex + 1),
    [activeIndex, goTo],
  );

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      next();
    }, 3500);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = startX.current - e.clientX;
    trackRef.current.scrollLeft = startScrollLeft.current + delta;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    trackRef.current.releasePointerCapture(e.pointerId);

    const track = trackRef.current;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    goTo(nearest);
  };

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

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2
              id="tutor-carousel-headline"
              className="text-3xl sm:text-4xl text-primary leading-tight"
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
              onClick={prev}
              aria-label="Gia sư trước"
              className="w-10 h-10 rounded-full border border-[#dce8fb] flex items-center justify-center
                text-primary transition-all duration-200
                hover:bg-primary hover:text-white hover:border-primary"
            >
              <CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label="Gia sư tiếp theo"
              className="w-10 h-10 rounded-full border border-[#dce8fb] flex items-center justify-center
                text-primary transition-all duration-200
                hover:bg-primary hover:text-white hover:border-primary"
            >
              <CaretRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          role="list"
          aria-label="Danh sách gia sư nổi bật"
          className="flex gap-24 overflow-x-auto pb-8 select-none cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
            paddingInline: "max(1rem, calc(50% - 150px))",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {TUTORS.map((tutor, i) => (
            <div
              key={tutor.id}
              role="listitem"
              onClick={() => goTo(i)}
              className="shrink-0 transition-all duration-300"
              style={{
                scrollSnapAlign: "center",
                width: "min(300px, 80vw)",
                opacity: i === activeIndex ? 1 : 0.65,
                transform: i === activeIndex ? "scale(1)" : "scale(0.94)",
              }}
            >
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
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Chọn gia sư"
        >
          {TUTORS.map((tutor, i) => (
            <button
              key={tutor.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Xem gia sư ${tutor.name}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                background:
                  i === activeIndex ? "#280F91" : "rgba(40,15,145,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
