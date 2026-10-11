import type { ReactNode } from "react";
import { AnimatedContent } from "./react-bits/AnimatedContent";

type PortalRevealProps = {
  children: ReactNode;
  className?: string;
  from?: "left" | "right" | "bottom";
  delay?: number;
};

export function PortalReveal({
  children,
  className,
  from = "bottom",
  delay = 0,
}: PortalRevealProps) {
  return (
    <AnimatedContent className={className} direction={from === "bottom" ? "vertical" : "horizontal"} reverse={from === "left"} delay={delay}>
      {children}
    </AnimatedContent>
  );
}
