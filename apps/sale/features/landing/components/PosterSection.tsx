"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function PosterSection() {
  const router = useRouter();
  return (
    <section
      className="relative w-full lg:h-[110vh] lg:min-h-[500px] overflow-hidden cursor-pointer flex flex-col"
      onClick={() => router.push("/login")}
    >
      {/* Desktop version */}
      <div className="hidden sm:block absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783571337/Banner-1_uob9l0.png"
          alt="BeeWise Highlights"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>
      {/* Mobile version */}
      <div className="block sm:hidden relative w-full leading-0">
        <Image
          src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561296/beewise/Banner-2.png"
          alt="BeeWise Highlights Mobile"
          width={800}
          height={1200}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </section>
  );
}
