"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import type { DashboardDetail } from "../types/learner-dashboard.types";

export function LearningDetailDialog({ detail, onClose }: { detail: DashboardDetail | null; onClose: () => void }) {
  return <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl border-border bg-card p-6 sm:max-w-lg">
      <DialogHeader>
        <p className="mb-2 text-xs font-bold text-warning">{detail?.label} · Minh họa</p>
        <DialogTitle className="text-xl font-extrabold">{detail?.title}</DialogTitle>
        <DialogDescription className="pt-2 text-sm leading-6 text-muted-foreground">{detail?.description}</DialogDescription>
      </DialogHeader>
      <dl className="mt-2 space-y-3">{detail?.facts.map((fact) => <div key={fact.label} className="flex flex-wrap justify-between gap-2 rounded-xl bg-muted px-4 py-3 text-sm"><dt className="text-muted-foreground">{fact.label}</dt><dd className="font-semibold">{fact.value}</dd></div>)}</dl>
    </DialogContent>
  </Dialog>;
}