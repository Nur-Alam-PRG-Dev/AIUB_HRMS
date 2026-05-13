import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-base-200 via-base-300 to-base-200",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-surface rounded-lg border border-border">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}
