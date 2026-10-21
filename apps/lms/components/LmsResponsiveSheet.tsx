"use client";

import type { ReactNode } from "react";
import { useIsMobile } from "@workspace/core/hooks/use-mobile";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@workspace/ui/components/ui/sheet";

interface LmsResponsiveSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Sticky action bar; sits at the bottom edge on mobile. */
  footer?: ReactNode;
  children: ReactNode;
}

/** Right-side sheet on desktop, bottom sheet on mobile. */
export function LmsResponsiveSheet({ open, onOpenChange, title, description, footer, children }: LmsResponsiveSheetProps) {
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[88dvh] gap-0 rounded-t-[var(--radius-panel)] border-border bg-popover p-0 shadow-pop" : "w-full gap-0 border-border bg-popover p-0 shadow-pop sm:max-w-lg"}
      >
        <SheetHeader className="border-b border-border px-5 py-4 pr-14">
          <SheetTitle className="text-lg font-extrabold">{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : <SheetDescription className="sr-only">{title}</SheetDescription>}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <SheetFooter className="mt-0 flex-row flex-wrap justify-end gap-2 border-t border-border bg-popover px-5 py-3">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
