import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function SkeletonTable({
  className,
  rows,
}: React.HTMLAttributes<HTMLDivElement> & { rows: number }) {
  return (
    <div className=" mx-auto mt-10">
      <Skeleton className={cn("max-w-[700px] h-8 my-4", className)} />
      <div className="flex flex-col gap-2 ">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex}>
            <Skeleton key={rowIndex} className={cn("w-full h-14", className)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton, SkeletonTable };
