import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import React, { JSX } from 'react';

export interface CarouselItemData {
  id: string | number;
  component: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItemData[];
  itemWidth?: number;
  gap?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
}

export interface CarouselRef {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({ item, index, itemWidth, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [45, 0, -45]; // Rotate slightly less than 90 for a nicer 3D effect
  const rotateY = useTransform(x, range, outputRange, { clamp: false });
  // Dynamic scale and opacity based on position
  const scale = useTransform(x, range, [0.94, 1, 0.94], { clamp: false });
  const opacity = useTransform(x, range, [0.65, 1, 0.65], { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className="relative shrink-0 flex flex-col justify-center overflow-visible cursor-grab active:cursor-grabbing"
      style={{
        width: itemWidth,
        rotateY: rotateY,
        scale: scale,
        opacity: opacity,
      }}
      transition={transition}
    >
      {item.component}
    </motion.div>
  );
}

const Carousel = forwardRef<CarouselRef, CarouselProps>(({
  items = [],
  itemWidth = 260,
  gap = 24,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  onIndexChange
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const trackItemOffset = itemWidth + gap;
  const centerOffset = containerWidth > 0 ? (containerWidth - itemWidth) / 2 : 0;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const activeIndex = items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);
  
  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  useImperativeHandle(ref, () => ({
    next: () => setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1)),
    prev: () => setPosition(prev => Math.max(0, prev - 1)),
    goTo: (index: number) => setPosition(loop ? index + 1 : index),
  }));

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible w-full py-8"
    >
      <motion.div
        className="flex items-center"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          gap: `${gap}px`,
          perspective: 1200,
          perspectiveOrigin: `${position * trackItemOffset + centerOffset + itemWidth / 2}px 50%`,
          x,
          paddingLeft: `${centerOffset}px`,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>
    </div>
  );
});

Carousel.displayName = 'Carousel';
export default Carousel;
