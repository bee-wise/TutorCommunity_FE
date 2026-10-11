"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/core/helpers/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
));
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName;

const disclosureCardVariants = cva(
  "group/disclosure rounded-2xl transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-card text-card-foreground shadow-2xs hover:border-primary/40 data-[state=open]:border-primary/50 data-[state=open]:shadow-soft",
        subtle:
          "border border-border/80 bg-muted/30 hover:bg-muted/50 data-[state=open]:bg-muted/60 data-[state=open]:border-primary/40",
        outline:
          "border border-border bg-transparent hover:border-primary/40 data-[state=open]:border-primary/50",
        ghost:
          "border-transparent hover:bg-muted/40 data-[state=open]:bg-muted/30",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-5 sm:p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface DisclosureCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, "title">,
    VariantProps<typeof disclosureCardVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

const DisclosureCard = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  DisclosureCardProps
>(
  (
    {
      title,
      description,
      icon,
      badge,
      action,
      variant,
      size,
      className,
      headerClassName,
      contentClassName,
      children,
      defaultOpen,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    return (
      <Collapsible
        ref={ref}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={cn(disclosureCardVariants({ variant, size, className }))}
        {...props}
      >
        <div className={cn("flex items-center justify-between gap-3", headerClassName)}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-xl cursor-pointer select-none group/trigger active:scale-[0.99]"
            >
              <div className="flex min-w-0 items-center gap-3">
                {icon && (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover/trigger:bg-primary/15 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                    {icon}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-nunito text-sm font-extrabold text-foreground group-hover/trigger:text-primary transition-colors">
                      {title}
                    </span>
                    {badge}
                  </div>
                  {description && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate font-sans">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all duration-200 group-hover/trigger:border-primary/40 group-hover/trigger:text-primary group-data-[state=open]:rotate-180 group-data-[state=open]:bg-primary/10 group-data-[state=open]:text-primary">
                  <ChevronDownIcon className="size-4.5 transition-transform duration-200" />
                </span>
              </div>
            </button>
          </CollapsibleTrigger>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        <CollapsibleContent className={cn("pt-4 text-sm", contentClassName)}>
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
DisclosureCard.displayName = "DisclosureCard";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  DisclosureCard,
  disclosureCardVariants,
};
