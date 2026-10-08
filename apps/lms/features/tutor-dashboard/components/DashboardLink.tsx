import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@workspace/core/helpers/utils";
import { Button } from "@workspace/ui/components/ui/button";

export function DashboardLink({ href, children, variant = "primary", className }: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "accent";
  className?: string;
}) {
  return (
    <Button asChild variant={variant === "outline" ? "outline" : "default"} className={cn(
      "min-h-11 rounded-full border px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none",
      variant === "primary" && "border-primary bg-primary text-primary-foreground",
      variant === "outline" && "border-border bg-card text-primary",
      variant === "accent" && "border-accent bg-accent text-accent-foreground hover:bg-highlight",
      className,
    )}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
