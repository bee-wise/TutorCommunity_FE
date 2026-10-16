"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/core/helpers/utils";

type AIActionButtonProps = ComponentPropsWithoutRef<"button">;

export function AIActionButton({ children, className, type = "button", ...props }: AIActionButtonProps) {
  return <Button {...props} type={type} className={cn("min-h-11 rounded-xl px-5 font-bold shadow-lg shadow-primary/15 transition-all duration-300 active:scale-[0.98] motion-reduce:transform-none", className)}>{children}</Button>;
}