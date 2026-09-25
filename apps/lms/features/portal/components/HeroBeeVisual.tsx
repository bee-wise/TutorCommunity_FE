import Image from "next/image";

export function HeroBeeVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[590px] overflow-hidden lg:max-w-none">
      <div
        className="absolute inset-[12%] rotate-[-12deg] rounded-[36%] border border-[#280f91]/10 bg-[#dbe7ff]/60"
        aria-hidden="true"
      />
      <Image
        src="/images/bee-phone.png"
        alt="Ong BeeWise bay cùng điện thoại trong khung lục giác xanh"
        width={1440}
        height={1440}
        preload
        sizes="(max-width: 1023px) min(100vw, 590px), 48vw"
        className="relative h-full w-full scale-[1.32] object-contain"
      />
    </div>
  );
}
