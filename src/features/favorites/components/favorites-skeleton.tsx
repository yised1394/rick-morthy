interface FavoritesSkeletonProps {
  readonly count?: number;
}

/**
 * Skeleton loader for favorites list.
 * Shows animated placeholders while favorite characters load.
 */
export function FavoritesSkeleton({ count = 4 }: FavoritesSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading favorites">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            {/* Name */}
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            {/* Status */}
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          
          {/* Favorite icon skeleton */}
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
      ))}
      <span className="sr-only">Loading favorite characters...</span>
    </div>
  );
}
