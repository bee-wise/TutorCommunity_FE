"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  pause?: boolean;
  onlyPlayInView?: boolean;
  onCardClick?: (idx: number) => void;
  onActiveChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] cursor-pointer ${customClass ?? ""} ${className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number,
  side: "left" | "right" = "left",
): Slot => {
  const dir = side === "left" ? 1 : -1;
  return {
    x: i * distX * dir,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
  };
};

const placeNow = (
  el: HTMLElement,
  slot: Slot,
  skew: number,
  side: "left" | "right" = "left",
) => {
  const actualSkew = side === "left" ? -skew : skew;
  const rotationY = side === "left" ? 6 : -6;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: actualSkew,
    rotationY: rotationY,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  pause = false,
  onlyPlayInView = true,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = "elastic",
  side = "left",
  className = "",
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length],
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i),
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const isInViewRef = useRef<boolean>(!onlyPlayInView);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(
          r.current,
          makeSlot(i, cardDistance, verticalDistance, total, side),
          skewAmount,
          side,
        );
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;
      if (pause || isHoveredRef.current || !isInViewRef.current) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length, side);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
        side,
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        const newOrder = [...rest, front];
        order.current = newOrder;
        onActiveChange?.(newOrder[0]);
      });
    };

    const startTimer = () => {
      if (intervalRef.current === null && !pause && isInViewRef.current && !isHoveredRef.current) {
        intervalRef.current = window.setInterval(swap, delay);
      }
    };

    const stopTimer = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // IntersectionObserver: Chỉ chạy chuyển động khi container lướt vào tầm nhìn
    let observer: IntersectionObserver | null = null;
    const node = container.current;

    if (onlyPlayInView && node && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            tlRef.current?.play();
            startTimer();
          } else {
            tlRef.current?.pause();
            stopTimer();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(node);
    } else {
      startTimer();
    }

    // Hover listeners
    if (pauseOnHover && node) {
      const onMouseEnter = () => {
        isHoveredRef.current = true;
        tlRef.current?.pause();
        stopTimer();
      };
      const onMouseLeave = () => {
        isHoveredRef.current = false;
        tlRef.current?.play();
        if (isInViewRef.current) {
          startTimer();
        }
      };
      node.addEventListener("mouseenter", onMouseEnter);
      node.addEventListener("mouseleave", onMouseLeave);

      return () => {
        observer?.disconnect();
        stopTimer();
        node.removeEventListener("mouseenter", onMouseEnter);
        node.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return () => {
      observer?.disconnect();
      stopTimer();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, pause, onlyPlayInView, skewAmount, easing, side, onActiveChange, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div
      ref={container}
      className={`relative flex items-center justify-center origin-center [perspective:1000px] overflow-visible max-[768px]:scale-[0.8] max-[480px]:scale-[0.6] ${className}`}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
