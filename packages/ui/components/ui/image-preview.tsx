"use client";

import * as React from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { cn } from "@workspace/core/helpers/utils";

const CLOUDINARY = "https://res.cloudinary.com/xcrm6ykz/image/upload";
const LOGO_MARK = `${CLOUDINARY}/e_trim/f_auto,q_auto,w_64/v1789964842/Logo_1.png`;
const MASCOT_PEEK = `${CLOUDINARY}/e_trim/f_auto,q_auto,w_192/v1789966159/18.png`;
const MASCOT_ERROR = `${CLOUDINARY}/e_trim/f_auto,q_auto,w_256/v1789966155/10.png`;

export interface ImagePreviewItem {
  src: string;
  alt: string;
  /** Short caption shown in the frame header (defaults to `alt`). */
  caption?: string;
}

export interface ImagePreviewProps {
  /** Single image. Ignored when `items` is provided. */
  src?: string;
  alt?: string;
  caption?: string;
  /** Gallery mode: several images with prev/next and keyboard arrows. */
  items?: ImagePreviewItem[];
  /** Which item opens first in gallery mode. */
  startIndex?: number;
  /** The thumbnail / element the user clicks. Rendered inside a button. */
  children: React.ReactNode;
  /** Classes for the trigger button (size, rounding, etc.). */
  className?: string;
  /** Accessible name of the trigger. Defaults to "Xem ảnh: <alt>". */
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function PreviewStage({ item }: { item: ImagePreviewItem }) {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading",
  );

  return (
    <div className="relative h-[min(62dvh,640px)] overflow-hidden rounded-3xl bg-muted">
      {status === "loading" ? (
        <div
          className="absolute inset-0 animate-pulse bg-muted motion-reduce:animate-none"
          role="status"
          aria-label="Đang tải ảnh"
        />
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <Image
            src={MASCOT_ERROR}
            alt=""
            width={112}
            height={112}
            className="size-28 object-contain"
          />
          <p className="text-sm font-bold text-foreground">
            Không tải được ảnh này
          </p>
          <p className="text-xs text-muted-foreground">
            Ảnh có thể đã bị gỡ hoặc đường truyền đang chậm.
          </p>
        </div>
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          unoptimized
          sizes="(min-width: 896px) 832px, 92vw"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className={cn(
            "object-contain transition-opacity duration-300 motion-reduce:transition-none",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

const navButton =
  "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-pop transition hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Click-to-preview image with BeeWise styling: a framed dialog with the
 * BeeWise mark, a peeking bee mascot, gallery arrows and a graceful error state.
 *
 * <ImagePreview src={url} alt="Chứng chỉ IELTS">
 *   <Image ... />
 * </ImagePreview>
 */
export function ImagePreview({
  src,
  alt = "",
  caption,
  items,
  startIndex = 0,
  children,
  className,
  triggerLabel,
  open,
  onOpenChange,
}: ImagePreviewProps) {
  const gallery = React.useMemo<ImagePreviewItem[]>(
    () => items ?? (src ? [{ src, alt, caption }] : []),
    [items, src, alt, caption],
  );
  const [innerOpen, setInnerOpen] = React.useState(false);
  const [index, setIndex] = React.useState(startIndex);
  const isOpen = open ?? innerOpen;

  const setOpen = (next: boolean) => {
    if (next) setIndex(Math.min(Math.max(startIndex, 0), gallery.length - 1));
    setInnerOpen(next);
    onOpenChange?.(next);
  };

  if (gallery.length === 0) return <>{children}</>;

  const current = gallery[Math.min(index, gallery.length - 1)]!;
  const hasMany = gallery.length > 1;
  const go = (step: number) =>
    setIndex((value) => (value + step + gallery.length) % gallery.length);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel ?? `Xem ảnh: ${gallery[0]!.alt || "ảnh"}`}
        className={cn(
          "group/preview relative block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full border border-border bg-card text-primary opacity-0 shadow-pop transition group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
        >
          <MagnifyingGlassPlusIcon className="size-4" />
        </span>
      </button>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          onKeyDown={(event) => {
            if (!hasMany) return;
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,56rem)] -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
        >
          <Image
            src={MASCOT_PEEK}
            alt=""
            width={80}
            height={80}
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 right-6 size-20 object-contain sm:right-10"
          />

          <div className="relative rounded-[var(--radius-panel)] border border-border bg-card p-3 shadow-pop sm:p-4">
            <div className="flex items-center justify-between gap-3 pb-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Image
                  src={LOGO_MARK}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 object-contain"
                />
                <DialogPrimitive.Title className="truncate text-sm font-extrabold text-foreground sm:text-base">
                  {current.caption || current.alt || "Xem ảnh"}
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close
                aria-label="Đóng ảnh"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XMarkIcon className="size-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            <DialogPrimitive.Description className="sr-only">
              {current.alt || "Xem ảnh phóng to"}
            </DialogPrimitive.Description>

            <div className="relative">
              <PreviewStage key={current.src} item={current} />
              {hasMany ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Ảnh trước"
                    className={cn(navButton, "left-3")}
                  >
                    <ChevronLeftIcon className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Ảnh tiếp theo"
                    className={cn(navButton, "right-3")}
                  >
                    <ChevronRightIcon className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3">
              <p className="text-xs font-bold tabular-nums text-muted-foreground">
                {hasMany ? `${index + 1} / ${gallery.length}` : "BeeWise"}
              </p>
              <a
                href={current.src}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-xs font-bold text-foreground transition hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PhotoIcon className="size-4 text-primary" aria-hidden="true" />
                Mở ảnh gốc
              </a>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
