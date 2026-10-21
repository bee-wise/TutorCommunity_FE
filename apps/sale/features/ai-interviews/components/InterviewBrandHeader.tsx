import Image from "next/image";

export function InterviewBrandHeader() {
  return (
    <div aria-label="BeeWise AI Interview" className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:px-6">
      <div className="relative h-9 w-36 shrink-0 overflow-hidden sm:h-11 sm:w-44">
        <Image
          src="https://res.cloudinary.com/xcrm6ykz/image/upload/f_auto,q_auto,w_400/v1790065308/Logo_2.png"
          alt="BeeWise"
          width={196}
          height={123}
          priority
          className="absolute left-1/2 top-1/2 h-auto w-40 max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-[196px]"
        />
      </div>
      <Image
        src="/images/interview/Bee.svg"
        alt="Trợ lý phỏng vấn Bee"
        width={150}
        height={45}
        priority
        className="h-9 w-auto max-w-[40%] object-contain object-right sm:h-11"
      />
    </div>
  );
}
