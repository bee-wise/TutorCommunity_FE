"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";

interface LmsMaterialViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Badges such as source, file type or "new". */
  badges?: ReactNode;
  /** One-line metadata, e.g. share date and file size. */
  meta?: ReactNode;
  /** The document body; pass the rendered content for the material type. */
  children: ReactNode;
}

/** Read-only viewer chrome shared by tutor and learner materials. It does not know how to render a document body. */
export function LmsMaterialViewer({ open, onOpenChange, title, badges, meta, children }: LmsMaterialViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-3xl border-border bg-popover p-0 shadow-pop sm:rounded-3xl motion-reduce:animate-none [&>button]:size-11 [&>button]:rounded-full [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:opacity-100 [&>button]:transition-all [&>button]:hover:bg-muted [&>button]:active:scale-[0.98]">
        <DialogHeader className="border-b border-border px-5 py-5 pr-20 text-left sm:px-6 sm:pr-20">
          <DialogTitle className="font-lms text-xl font-extrabold leading-snug tracking-normal text-primary [overflow-wrap:anywhere]">{title}</DialogTitle>
          {badges}
          {meta ? <DialogDescription>{meta}</DialogDescription> : <DialogDescription className="sr-only">{title}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
