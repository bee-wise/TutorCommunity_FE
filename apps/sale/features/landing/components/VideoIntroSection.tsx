"use client";

import {
  PlayCircle,
  CheckCircle,
  Student,
  ChalkboardTeacher,
  Handshake,
} from "@phosphor-icons/react";
import Image from "next/image";

export function VideoIntroSection() {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mx-auto lg:mx-0">
              Khám phá BeeWise
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-primary leading-[1.2] font-nunito uppercase">
              Nền tảng <span className="text-accent">2 trong 1</span>
            </h2>

            <p className="text-foreground/70 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              BeeWise là nền tảng kết nối trực tiếp học viên với những gia sư
              chất lượng, giúp quá trình học tập và giảng dạy dễ dàng hơn bao
              giờ hết.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  icon: Student,
                  title: "Học viên hài lòng",
                  desc: "Nhiều đánh giá tốt",
                },
                {
                  icon: ChalkboardTeacher,
                  title: "Gia sư chuyên nghiệp",
                  desc: "Đã qua kiểm duyệt",
                },
                {
                  icon: Handshake,
                  title: "Kết nối nhanh chóng",
                  desc: "Beewise AI",
                },
                {
                  icon: CheckCircle,
                  title: "An toàn & Minh bạch",
                  desc: "Đánh giá từ học viên",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <item.icon size={26} weight="fill" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold font-google-sans text-foreground text-base">
                      {item.title}
                    </h4>
                    <p className="text-sm text-foreground/60 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl lg:max-w-none mx-auto">
            <div className="relative aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl shadow-primary/10 group cursor-pointer border-[10px] border-card">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
                <Image
                  src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783571337/Banner-1_uob9l0.png"
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative group-hover:scale-110 transition-transform duration-300 ease-out">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-40 duration-1000" />
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl relative z-10">
                    <PlayCircle
                      size={48}
                      weight="fill"
                      className="text-primary ml-1 sm:ml-2 sm:w-[56px] sm:h-[56px]"
                    />
                  </div>
                </div>
              </div>

              {/* Cute floating badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out text-foreground">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Xem giới thiệu nền tảng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
