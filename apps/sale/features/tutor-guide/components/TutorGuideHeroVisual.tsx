import Image from "next/image";

export function TutorGuideHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:mx-0 lg:ml-auto">
      <div
        data-hero-visual
        className="relative isolate overflow-hidden rounded-[2rem] border border-primary/10 bg-[#edeaff] p-3 shadow-[0_32px_80px_rgba(40,15,145,0.18)] sm:rounded-[2.5rem] sm:p-4"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/60 blur-3xl"
          aria-hidden="true"
        />
        <div
          data-hero-media
          className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-primary sm:rounded-[2rem]"
        >
          <Image
            src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789967862/15.png"
            alt="Minh họa hành trình gia sư trên nền tảng BeeWise"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover object-center scale-[1.52]"
          />
        </div>
      </div>
    </div>
  );
}
