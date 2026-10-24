"use client";

import { useState } from "react";
import { MapIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog";
import { LearningPath, type LearningPathStage } from "@workspace/ui/components/ui/learning-path";
import { buttonClass } from "./ClassUi";

export function GroupRoadmapVisualDialog({ stages }: { stages: readonly LearningPathStage[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className={buttonClass}>
          <MapIcon className="size-4" aria-hidden="true" />
          Xem trực quan
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(52rem,94dvh)] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border-border bg-popover p-5 shadow-pop sm:p-8">
        <DialogHeader className="pr-8">
          <DialogTitle className="font-nunito text-xl font-extrabold leading-[1.2]">Lộ trình học trực quan</DialogTitle>
          <DialogDescription>Rê chuột hoặc focus vào từng bài để xem nội dung chi tiết.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
          <LearningPath stages={stages} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
