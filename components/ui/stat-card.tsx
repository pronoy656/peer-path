import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  hintTone = "neutral",
  icon,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  hintTone?: "success" | "danger" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] flex items-start justify-between gap-3",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-[28px] font-bold font-display leading-tight text-foreground mt-1">
          {value}
        </p>
        {hint && (
          <p
            className={cn(
              "text-xs font-medium mt-1",
              hintTone === "success"
                ? "text-success"
                : hintTone === "danger"
                ? "text-danger"
                : "text-muted-foreground"
            )}
          >
            {hint}
          </p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
