import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@workspace/core/helpers/utils";
import styles from "./dashboard.module.css";

export function DashboardLink({ href, children, variant = "primary", className }: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "accent";
  className?: string;
}) {
  return (
    <Link href={href} className={cn(
      styles.action,
      "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-bold whitespace-nowrap",
      variant === "primary" && "border-primary bg-primary text-primary-foreground",
      variant === "outline" && "border-border bg-card text-primary",
      variant === "accent" && "border-accent bg-accent text-accent-foreground",
      className,
    )}>
      {children}
    </Link>
  );
}
