import { Button } from '@/shared/components/ui/button';
import { ChevronIcon } from '@/shared/components/icons/chevron-icon';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

/**
 * Pagination controls for character list.
 * Compact layout: shows ±1 pages around current to prevent overflow.
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
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="Go to previous page"
        className="!px-2"
      >
        <ChevronIcon direction="left" size={16} />
      </Button>

      <div className="flex items-center gap-0.5">
        {visiblePages[0] !== undefined && visiblePages[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(1)}
              aria-label="Go to page 1"
              aria-current={currentPage === 1 ? 'page' : undefined}
              className="!px-2"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-1 text-neutral-500">...</span>
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
            className="!px-2"
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] !== undefined &&
          visiblePages[visiblePages.length - 1]! < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1]! < totalPages - 1 && (
                <span className="px-1 text-neutral-500">...</span>
              )}
              <Button
                variant={currentPage === totalPages ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Go to page ${totalPages}`}
                aria-current={currentPage === totalPages ? 'page' : undefined}
                className="!px-2"
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
        className="!px-2"
      >
        <ChevronIcon direction="right" size={16} />
      </Button>
    </nav>
  );
}
