"use client";

import { ArrowDownTrayIcon as DownloadSimple, ReceiptPercentIcon as Receipt } from "@heroicons/react/24/outline";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { LearnerTuitionClass } from "../types/tuition-fee.types";
import {
  exportTuitionInvoice,
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";

export function TuitionInvoiceDialog({ invoice, onClose }: { invoice?: LearnerTuitionClass; onClose: () => void }) {
  function handleExport() {
    if (!invoice) return;
    exportTuitionInvoice(invoice);
    toast.success("Đã xuất hóa đơn", { description: invoice.invoiceNumber });
  }

  return (
    <Dialog open={Boolean(invoice)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl p-0">
        {invoice ? <>
          <DialogHeader className="border-b border-border bg-muted px-5 py-5 pr-12 text-left sm:px-6">
            <span className="grid size-10 place-items-center rounded-xl bg-muted text-primary"><Receipt width={20} height={20} /></span>
            <DialogTitle className="pt-2 text-xl font-extrabold">Hóa đơn học phí</DialogTitle>
            <DialogDescription>{invoice.invoiceNumber}</DialogDescription>
          </DialogHeader>
          <dl className="divide-y divide-border px-5 sm:px-6">
            <InvoiceRow label="Lớp học" value={invoice.className} />
            <InvoiceRow label="Gia sư" value={invoice.tutorName} />
            <InvoiceRow label="Gói học" value={invoice.packageName} />
            <InvoiceRow label="Mã đơn SALE" value={invoice.saleOrderCode} />
            <InvoiceRow label="Ngày phát hành" value={formatTuitionDate(invoice.invoiceIssuedAt)} />
            <InvoiceRow label="Tổng đã thanh toán" value={formatTuitionCurrency(invoice.totalPaid)} emphasis />
          </dl>
          <div className="mx-5 rounded-xl bg-secondary/15 px-4 py-3 text-sm font-bold text-foreground sm:mx-6">Đã thanh toán qua BeeWise SALE</div>
          <DialogFooter className="gap-2 border-t border-border px-5 py-4 sm:px-6">
            <button type="button" onClick={onClose} className="h-10 rounded-xl border border-input px-4 text-sm font-bold hover:bg-muted">Đóng</button>
            <button type="button" onClick={handleExport} className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 active:scale-[0.98]"><DownloadSimple width={18} height={18} />Tải hóa đơn</button>
          </DialogFooter>
        </> : null}
      </DialogContent>
    </Dialog>
  );
}

function InvoiceRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className="grid gap-1 py-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center"><dt className="text-sm text-muted-foreground">{label}</dt><dd className={`text-sm sm:text-right ${emphasis ? "text-lg font-extrabold text-primary" : "font-bold text-foreground"}`}>{value}</dd></div>;
}
