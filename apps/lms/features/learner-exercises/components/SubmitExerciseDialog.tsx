import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";

export function SubmitExerciseDialog({ open, title, description, confirmLabel = "Nộp bài", onOpenChange, onConfirm }: { open: boolean; title: string; description: string; confirmLabel?: string; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl"><DialogHeader><DialogTitle className="text-xl font-extrabold">{title}</DialogTitle><DialogDescription className="leading-6">{description}</DialogDescription></DialogHeader><DialogFooter className="gap-2"><button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-input px-4 text-sm font-bold hover:bg-muted">Xem lại</button><button type="button" onClick={() => { onConfirm(); onOpenChange(false); }} className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.98]">{confirmLabel}</button></DialogFooter></DialogContent></Dialog>;
}
