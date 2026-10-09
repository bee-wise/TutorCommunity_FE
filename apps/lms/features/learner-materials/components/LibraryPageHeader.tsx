import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/ui/button";
import { libraryOutlineButton } from "./learner-materials-ui";

export function LibraryPageHeader({ title, description, backHref, backLabel, children }: {
  title: string; description: string; backHref?: string; backLabel?: string; children?: ReactNode;
}) {
  return (
    <header className="space-y-3">
      {backHref && <Link href={backHref} className={buttonVariants({ variant: "outline", className: libraryOutlineButton })}>{backLabel ?? "Quay lại"}</Link>}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl [overflow-wrap:anywhere]">{title}</h1>
        <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-muted-foreground">Dữ liệu minh họa</span>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </header>
  );
}
