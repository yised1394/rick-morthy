import { Button } from '@/shared/components/ui/button';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

/**
 * Pagination controls for character list.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="Go to previous page"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      <div className="flex items-center gap-1">
        {visiblePages[0] !== undefined && visiblePages[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(1)}
              aria-label="Go to page 1"
              aria-current={currentPage === 1 ? 'page' : undefined}
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-neutral-500">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] !== undefined &&
          visiblePages[visiblePages.length - 1]! < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1]! < totalPages - 1 && (
                <span className="px-2 text-neutral-500">...</span>
              )}
              <Button
                variant={currentPage === totalPages ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Go to page ${totalPages}`}
                aria-current={currentPage === totalPages ? 'page' : undefined}
              >
                {totalPages}
              </Button>
            </>
          )}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        aria-label="Go to next page"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </nav>
  );
}
