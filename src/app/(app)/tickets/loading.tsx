import LoadingSpinner from "@/components/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="mb-6 p-4 border rounded-lg bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="rounded-md border">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b">
            {/* <Skeleton className="h-4 w-4" /> Placeholder for checkbox */}
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 md:hidden" />
            </div>
            <Skeleton className="h-6 w-24 hidden md:block" />
            <Skeleton className="h-6 w-20 hidden md:block" />
            <Skeleton className="h-4 w-28 hidden lg:block" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
