"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@workspace/core/helpers/utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "group flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 py-2 text-left text-sm text-foreground outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-60 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-ring/30",
      className,
    )}
    {...props}
  >
    <span className="min-w-0 truncate">{children}</span>
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { portalContainer?: HTMLElement | null }
>(({ className, children, portalContainer, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal container={portalContainer ?? undefined}>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={6}
      className={cn(
        "z-[60] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-card p-1 text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto p-0.5">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex min-h-9 cursor-pointer select-none items-center rounded-lg py-2 pr-9 pl-3 text-sm text-foreground outline-none transition-colors focus:bg-muted data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex items-center text-primary">
      <CheckIcon className="size-4" aria-hidden="true" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
