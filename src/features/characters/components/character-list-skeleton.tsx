interface CharacterListSkeletonProps {
  readonly count?: number;
}

/**
 * Skeleton loader for character list.
 * Shows animated placeholders while data loads.
 */
export function CharacterListSkeleton({ count = 6 }: CharacterListSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading characters">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            {/* Name */}
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            {/* Status and species */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading characters...</span>
    </div>
  );
}
