interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Basic skeleton loader component.
 * Pulsing gray background to indicate loading state.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      {...props}
    />
  );
}
