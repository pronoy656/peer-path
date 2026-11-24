import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 space-y-3 animate-pulse",
        className
      )}
    >
      <div className="h-36 rounded-xl bg-muted" />
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="h-5 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3 animate-pulse">
      <div className="h-4 w-1/4 rounded bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-muted/70" />
      ))}
    </div>
  );
}
