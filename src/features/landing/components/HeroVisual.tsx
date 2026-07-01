"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  BookOpenIcon,
  PencilSimpleIcon,
  MathOperationsIcon,
  BrainIcon,
  StarIcon,
  GraduationCapIcon,
  ChartLineUpIcon,
  LightbulbIcon,
  FlaskIcon,
  MusicNotesIcon,
} from "@phosphor-icons/react";

const FLOATING_ICONS = [
  {
    Icon: BookOpenIcon,
    top: "20%",
    left: "15%",
    size: 28,
    delay: 0,
    duration: 5.2,
    amplitude: 10,
    color: "#FFC500",
    bg: "rgba(255,197,0,0.15)",
    rotate: -12,
  },
  {
    Icon: PencilSimpleIcon,
    top: "18%",
    left: "82%",
    size: 22,
    delay: 0.8,
    duration: 4.8,
    amplitude: 8,
    color: "#FADC76",
    bg: "rgba(250,220,118,0.15)",
    rotate: 18,
  },
  {
    Icon: StarIcon,
    top: "10%",
    left: "55%",
    size: 18,
    delay: 1.4,
    duration: 6.1,
    amplitude: 12,
    color: "#FFC500",
    bg: "rgba(255,197,0,0.12)",
    rotate: 0,
    weight: "fill" as const,
  },
  {
    Icon: MathOperationsIcon,
    top: "38%",
    left: "4%",
    size: 24,
    delay: 0.5,
    duration: 5.5,
    amplitude: 9,
    color: "#CFE1FA",
    bg: "rgba(207,225,250,0.12)",
    rotate: 6,
  },
  {
    Icon: FlaskIcon,
    top: "45%",
    left: "87%",
    size: 22,
    delay: 1.1,
    duration: 4.6,
    amplitude: 11,
    color: "#FADC76",
    bg: "rgba(250,220,118,0.12)",
    rotate: -8,
  },
  {
    Icon: BrainIcon,
    top: "32%",
    left: "78%",
    size: 26,
    delay: 2.0,
    duration: 5.9,
    amplitude: 10,
    color: "#CFE1FA",
    bg: "rgba(207,225,250,0.15)",
    rotate: 10,
  },
  {
    Icon: GraduationCapIcon,
    top: "72%",
    left: "8%",
    size: 30,
    delay: 0.3,
    duration: 5.0,
    amplitude: 8,
    color: "#FFC500",
    bg: "rgba(255,197,0,0.15)",
    rotate: -6,
    weight: "fill" as const,
  },
  {
    Icon: ChartLineUpIcon,
    top: "78%",
    left: "82%",
    size: 22,
    delay: 1.7,
    duration: 6.3,
    amplitude: 13,
    color: "#FADC76",
    bg: "rgba(250,220,118,0.12)",
    rotate: 14,
  },
  {
    Icon: LightbulbIcon,
    top: "60%",
    left: "3%",
    size: 20,
    delay: 2.5,
    duration: 4.9,
    amplitude: 7,
    color: "#CFE1FA",
    bg: "rgba(207,225,250,0.10)",
    rotate: -4,
  },
  {
    Icon: MusicNotesIcon,
    top: "65%",
    left: "88%",
    size: 20,
    delay: 1.9,
    duration: 5.7,
    amplitude: 9,
    color: "#FFC500",
    bg: "rgba(255,197,0,0.10)",
    rotate: 20,
  },
];

function HexGrid() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hex-pattern-hero"
          x="0"
          y="0"
          width="60"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="15,0 45,0 60,26 45,52 15,52 0,26"
            fill="none"
            stroke="#CFE1FA"
            strokeWidth="1"
          />
          <polygon
            points="45,26 75,26 90,52 75,78 45,78 30,52"
            fill="none"
            stroke="#CFE1FA"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-pattern-hero)" />
    </svg>
  );
}

function StatBadge({
  value,
  label,
  delay,
  className,
}: {
  value: string;
  label: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-30 flex items-center gap-2.5 rounded-2xl px-4 py-2.5
        border border-white/15 shadow-lg shadow-[#280F91]/20 ${className}`}
      style={{
        background: "rgba(28, 10, 100, 0.55)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <span
        className="text-xl leading-none text-[#FFC500]"
        style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
      >
        {value}
      </span>
      <span className="text-xs text-white/75 leading-tight max-w-[80px]">
        {label}
      </span>
    </motion.div>
  );
}

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full flex items-end justify-center select-none"
      style={{ minHeight: "480px" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 bottom-0 rounded-3xl overflow-hidden"
        style={{
          top: "8%",
          background:
            "linear-gradient(145deg, #160860 0%, #280F91 45%, #3a18b5 75%, #160860 100%)",
        }}
      >
        <HexGrid />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 15% 90%, rgba(255,197,0,0.22) 0%, transparent 65%)," +
              "radial-gradient(ellipse 35% 35% at 90% 10%, rgba(207,225,250,0.10) 0%, transparent 60%)",
          }}
        />

        {[340, 240, 140].map((d, i) => (
          <div
            key={d}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: d,
              height: d,
              border: `1px solid rgba(255,197,0,${0.06 - i * 0.015})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {FLOATING_ICONS.map(
        (
          {
            Icon,
            top,
            left,
            size,
            delay,
            duration,
            amplitude,
            color,
            bg,
            rotate,
            weight,
          },
          i,
        ) => (
          <motion.div
            key={i}
            className="absolute z-10 flex items-center justify-center rounded-xl"
            style={{
              top,
              left,
              width: size + 20,
              height: size + 20,
              background: bg,
              border: "1px solid rgba(255,255,255,0.08)",
              rotate: `${rotate}deg`,
            }}
            animate={{ y: [0, -amplitude, 0, amplitude * 0.55, 0] }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          >
            <Icon
              size={size}
              weight={weight ?? "duotone"}
              color={color}
              aria-hidden="true"
            />
          </motion.div>
        ),
      )}

      <motion.div
        className="relative z-20"
        style={{ width: "75%", maxWidth: "380px" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/Hero-Image.png"
          alt="Sinh viên dùng BeeWise tìm gia sư phù hợp"
          width={380}
          height={500}
          className="w-full h-auto object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      <StatBadge
        value="500+"
        label="Gia sư đã xác thực"
        delay={0.75}
        className="bottom-[10%] left-20 -translate-x-1/4"
      />
      <StatBadge
        value="4.9★"
        label="Đánh giá trung bình"
        delay={0.9}
        className="top-[5%] right-15 translate-x-1/4"
      />
    </motion.div>
  );
}
