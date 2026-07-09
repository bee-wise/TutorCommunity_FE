"use client";

import { Clock, BookOpen, Bell } from "lucide-react";

interface OverviewCardsProps {
  todayCount: number;
  totalActiveCount: number;
  pendingCount: number;
}

interface CardData {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  isHighlighted?: boolean;
}

export function OverviewCards({
  todayCount,
  totalActiveCount,
  pendingCount,
}: OverviewCardsProps) {
  const cards: CardData[] = [
    {
      id: "today",
      label: "Hôm nay",
      value: todayCount,
      subtitle: "buổi học sắp tới",
      icon: Clock,
      accent: "#280f91",
      isHighlighted: false,
    },
    {
      id: "active",
      label: "Lớp đang hoạt động",
      value: totalActiveCount,
      subtitle: "lớp đang theo dõi",
      icon: BookOpen,
      accent: "#447353",
      isHighlighted: false,
    },
    {
      id: "pending",
      label: "Yêu cầu chờ xác nhận",
      value: pendingCount,
      subtitle: "lịch mới từ tư vấn viên",
      icon: Bell,
      accent: "#905b0f",
      isHighlighted: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-white px-5 py-5 transition-all duration-250 ease-out group hover:-translate-y-1 shadow-sm"
            style={{
              boxShadow: "0 1px 6px 0 rgba(40,15,145,0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mt-1">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {card.label}
                </p>
                <p className="text-4xl font-extrabold leading-none font-montserrat text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {card.subtitle}
                </p>
              </div>
              <div
                className="rounded-xl p-2.5 shrink-0 transition-transform duration-250 group-hover:scale-110"
                style={{ backgroundColor: `${card.accent}12` }}
              >
                <Icon
                  className="size-5"
                  style={{ color: card.accent }}
                  strokeWidth={1.75}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
