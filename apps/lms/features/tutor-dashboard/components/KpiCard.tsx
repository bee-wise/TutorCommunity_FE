"use client";

import React from "react";
import { Icon } from "@phosphor-icons/react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: Icon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const KpiCard = ({
  title,
  value,
  icon: IconComponent,
  description,
  trend,
  trendValue,
}: KpiCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-white/40 shadow-sm
      bg-[#fff3cb]/20 backdrop-blur-xl 
       
      flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300 ease-out"
    >
      {/* Inner shadow for physical edge refraction */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]  pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <p className="text-sm font-semibold text-gray-600 ">
          {title}
        </p>
        <div className="p-2 rounded-full bg-white/60  text-[#280F91] ">
          <IconComponent size={20} weight="duotone" />
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-[#280F91]  tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
          {value}
        </h3>
        
        {(description || trendValue) && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {trendValue && (
              <span
                className={`font-semibold ${
                  trend === "up"
                    ? "text-[#447353]"
                    : trend === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {trend === "up" && "+"}
                {trendValue}
              </span>
            )}
            {description && (
              <span className="text-gray-500 ">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
