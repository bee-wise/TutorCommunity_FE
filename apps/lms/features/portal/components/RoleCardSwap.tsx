"use client";

import Image from "next/image";
import CardSwap, { Card } from "@workspace/ui/components/CardSwap";
import type { RoleFeature } from "../data/roleFeatures";

type RoleCardSwapProps = {
  id: string;
  roleLabel: string;
  side: "left" | "right";
  features: readonly RoleFeature[];
  activeIndex: number;
  onSelect: (index: number) => void;
  reducedMotion: boolean;
};

export function RoleCardSwap({
  id,
  roleLabel,
  side,
  features,
  activeIndex,
  onSelect,
  reducedMotion,
}: RoleCardSwapProps) {
  const currentFeature = features[activeIndex] ?? features[0];

  return (
    <div
      id={id}
      role="group"
      aria-label={`Hình minh họa ${roleLabel.toLowerCase()}`}
      className="relative flex h-full w-full items-center justify-center overflow-visible"
    >
      {/* Mobile (< sm): Chỉ hiển thị 1 ảnh đơn theo tính năng đang chọn */}
      <div className="flex sm:hidden w-full items-center justify-center py-2">
        <div className="relative aspect-[1.4] w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#e5eaf5] bg-white shadow-[0_12px_32px_rgba(30,35,50,0.1)]">
          <span className="relative block h-full w-full bg-[#f7f8fc]">
            {currentFeature?.imageSrc ? (
              <Image
                src={currentFeature.imageSrc}
                alt={currentFeature.imageAlt}
                fill
                sizes="(max-width: 639px) 92vw, 500px"
                className="object-contain p-2"
                priority
              />
            ) : (
              <span className="flex h-full flex-col justify-end gap-2 p-6">
                <span className="text-xs font-semibold text-[#5a6a9a]">
                  Ảnh minh họa đang cập nhật
                </span>
                <span
                  className="max-w-[460px] text-xl font-extrabold leading-tight text-primary"
                  style={{ fontFamily: "var(--font-nunito-family)" }}
                >
                  {currentFeature?.title}
                </span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Tablet & Desktop (>= sm): Hiển thị CardSwap 3D animation */}
      <div className="hidden sm:flex h-full w-full items-center justify-center overflow-visible">
        <CardSwap
          width="100%"
          height="100%"
          cardDistance={42}
          verticalDistance={36}
          delay={2000}
          pauseOnHover={true}
          pause={reducedMotion}
          onlyPlayInView={true}
          side={side}
          skewAmount={3.5}
          easing="elastic"
          onCardClick={onSelect}
          onActiveChange={onSelect}
          className="h-full w-full max-w-[560px] aspect-[1.4]"
        >
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              customClass="w-full h-full aspect-[1.4] bg-white border border-[#e5eaf5] shadow-[0_16px_40px_rgba(30,35,50,0.12)] transition-shadow duration-200 hover:shadow-[0_20px_48px_rgba(30,35,50,0.18)]"
              aria-label={`Xem hình minh họa: ${feature.title}`}
              aria-pressed={activeIndex === index}
            >
              <span className="relative block h-full w-full bg-[#f7f8fc]">
                {feature.imageSrc ? (
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    sizes="(max-width: 639px) 90vw, (max-width: 1023px) 80vw, 560px"
                    className="object-contain p-2 sm:p-4"
                  />
                ) : (
                  <span className="flex h-full flex-col justify-end gap-3 p-7 sm:p-10">
                    <span className="text-xs font-semibold text-[#5a6a9a]">
                      Ảnh minh họa đang cập nhật
                    </span>
                    <span
                      className="max-w-[460px] text-2xl font-extrabold leading-tight text-primary sm:text-4xl"
                      style={{ fontFamily: "var(--font-nunito-family)" }}
                    >
                      {feature.title}
                    </span>
                  </span>
                )}
              </span>
            </Card>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}
