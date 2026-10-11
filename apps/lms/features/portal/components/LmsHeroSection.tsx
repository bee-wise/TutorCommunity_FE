import { Button } from "@workspace/ui/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { HeroBeeVisual } from "./HeroBeeVisual";
import { PortalReveal } from "./PortalReveal";
import { SplitText } from "./react-bits/SplitText";
import { PortalHeroBackground } from "./PortalHeroBackground";
import styles from "../styles/portal.module.css";

export function LmsHeroSection() {
  return (
    <section
      className={`relative isolate overflow-hidden pt-24 sm:pt-28 ${styles.heroAtmosphere}`}
    >
      <PortalHeroBackground />
      <div className="relative mx-auto grid max-w-7xl items-center gap-2 px-5 pb-14 pt-10 sm:px-8 lg:min-h-[min(740px,calc(100dvh-112px))] lg:grid-cols-[1.1fr_1fr] lg:gap-4 lg:pb-20 lg:pt-8">
        <div className="relative z-10">
          <SplitText
            tag="h1"
            text={"Dạy và học,\n"}
            accentText="cùng BeeWise LMS."
            className="max-w-[680px] whitespace-pre-line pb-2 text-[clamp(2.6rem,4.9vw,4.4rem)] font-semibold leading-[1.18] tracking-[-0.045em] text-primary"
          />
          <PortalReveal delay={0.25}>
            <p className="mt-6 max-w-[470px] text-base leading-7 text-muted-foreground sm:text-lg">
              Giúp gia sư quản lý việc dạy, giúp học viên quản lý việc học dễ
              dàng hơn
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="group h-12 rounded-xl px-5 transition-all hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none"
              >
                <a href="#learner">
                  Dành cho học viên{" "}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-primary/25 bg-background/80 px-5 text-primary transition-all hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none"
              >
                <a href="#tutor">Dành cho gia sư</a>
              </Button>
            </div>
          </PortalReveal>
        </div>
        <PortalReveal from="right" delay={0.15} className="min-w-0">
          <HeroBeeVisual />
        </PortalReveal>
      </div>
    </section>
  );
}
