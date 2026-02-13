import { SORT_OPTIONS } from '@/shared/constants/app.constants';
import type { SortOption } from '@/shared/constants/app.constants';

interface SortButtonProps {
  readonly sortBy: SortOption | '';
  readonly onToggle: () => void;
}

/**
 * Sort button for toggling between A-Z, Z-A, and no sort.
 */
export function SortButton({ sortBy, onToggle }: SortButtonProps) {
  const label = !sortBy ? 'Sort' : sortBy === SORT_OPTIONS.NAME_ASC ? 'A-Z' : 'Z-A';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all
        ${sortBy
          ? 'bg-primary-100 text-primary-600'
          : 'text-gray-500 hover:bg-gray-100'
        }
      `}
      aria-label={`Sort by name: ${label}`}
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      {label}
    </button>
  );
}
