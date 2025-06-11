import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTable() {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 gap-2 p-4">
        {[...Array(10)].map((_, idx) => (
          <div
            key={idx}
            className="col-span-4 grid grid-cols-4 gap-4 py-2 border-b"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
