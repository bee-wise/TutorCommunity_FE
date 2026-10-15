import { QRCodeSVG } from "qrcode.react";

interface PaymentQrCodeProps {
  value: string;
  bankName?: string;
  bankBin?: string;
}

export function PaymentQrCode({ value, bankName, bankBin }: PaymentQrCodeProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4">
      <div className="flex items-center justify-center gap-1.5 font-nunito text-base font-black tracking-tight">
        <span className="text-primary">VietQR</span>
        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-accent-foreground">
          PayOS
        </span>
      </div>
      <div className="mx-auto mt-3 w-fit rounded-lg border border-primary/30 bg-background p-1">
        <QRCodeSVG
          value={value}
          size={216}
          level="M"
          marginSize={4}
          bgColor="var(--background)"
          fgColor="var(--foreground)"
          title="Mã QR thanh toán PayOS"
          className="block h-auto max-w-full"
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 border-t border-border pt-3">
        <span className="font-nunito text-xs font-black tracking-tight text-primary">
          napas<span className="text-secondary">247</span>
        </span>
        {(bankName || bankBin) && (
          <>
            <span aria-hidden="true" className="h-5 w-px bg-border" />
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold text-muted-foreground">Ngân hàng thụ hưởng</p>
              <p className="truncate font-nunito text-xs font-black text-foreground">
                {bankName ?? `BIN ${bankBin}`}
              </p>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
        Quét mã bằng ứng dụng ngân hàng để thanh toán
      </p>
    </div>
  );
}
