import { Skeleton } from "@/components/ui/skeleton";

export function MusicPlayerSkeleton() {
  return (
    <div className="border rounded-2xl p-6 bg-card/60 shadow-sm animate-pulse space-y-6">
      {/* Album Cover & Track Title Info */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Skeleton className="h-32 w-32 rounded-xl shrink-0" />
        <div className="space-y-2 text-center sm:text-left flex-grow w-full">
          <Skeleton className="h-6 w-2/3 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-1/2 mx-auto sm:mx-0" />
          <div className="flex items-center justify-center sm:justify-start space-x-2 pt-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>

      {/* Progress Timeline Slider */}
      <div className="space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>

      {/* Media Play Controls */}
      <div className="flex items-center justify-center space-x-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Volume slider mock */}
      <div className="flex items-center justify-center space-x-2 pt-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-2 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function TrackListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 border rounded-xl bg-card/45 animate-pulse"
        >
          <div className="flex items-center space-x-3 w-full">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5 w-full">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}
export default MusicPlayerSkeleton;
