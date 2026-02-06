interface DeletedSkeletonProps {
  readonly count?: number;
}

/**
 * Skeleton loader for deleted characters list.
 * Shows animated placeholders while deleted characters load.
 */
export function DeletedSkeleton({ count = 4 }: DeletedSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading deleted characters">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="flex-shrink-0 w-14 h-14 bg-gray-200 rounded-full opacity-50" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            {/* Name */}
            <div className="h-4 bg-gray-200 rounded w-2/3 opacity-50" />
            {/* Metadata */}
            <div className="h-3 bg-gray-200 rounded w-1/2 opacity-50" />
          </div>
          
          {/* Restore button skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg opacity-50" />
        </div>
      ))}
      <span className="sr-only">Loading deleted characters...</span>
    </div>
  );
}
