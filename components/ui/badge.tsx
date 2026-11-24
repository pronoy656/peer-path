import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getDepartmentBadgeClass } from "@/lib/theme/tokens";
import type { Department } from "@/lib/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-foreground border-border",
        enrolled: "bg-green-50 text-green-700 border-green-200",
        pending: "bg-amber-50 text-amber-800 border-amber-200",
        saved: "bg-primary/10 text-primary border-primary/20",
        full: "bg-red-50 text-red-700 border-red-200",
        accent: "bg-accent/15 text-accent-foreground border-accent/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export function Badge({
  className,
  variant,
  department,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    department?: Department | string;
  }) {
  if (department) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
          getDepartmentBadgeClass(department),
          className
        )}
        {...props}
      />
    );
  }
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
