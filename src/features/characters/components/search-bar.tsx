import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onFilterClick: () => void;
  readonly placeholder?: string;
  readonly activeFiltersCount?: number;
  readonly isFilterOpen?: boolean;
}

/**
 * Search bar component with filter button (Figma design).
 * Features search icon on left and filter icon on right.
 */
export function SearchBar({
  value,
  onChange,
  onFilterClick,
  placeholder = 'Search or filter results',
  activeFiltersCount = 0,
  isFilterOpen = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const debouncedValue = useDebounce(inputValue, 300);

  // Icon state: active (panel open) > hover > idle
  const showPillBackground = isFilterOpen || isFilterHovered;

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative flex items-center">
      {/* Search Icon */}
      <svg
        className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-gray-200 bg-gray-50
          pl-10 pr-12 py-3 text-sm
          placeholder:text-gray-400
          focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:bg-white
          transition-colors
        "
      />

      {/* Filter Button */}
      <button
        type="button"
        onClick={onFilterClick}
        onMouseEnter={() => setIsFilterHovered(true)}
        onMouseLeave={() => setIsFilterHovered(false)}
        className={`
          absolute right-2 p-2 rounded-lg transition-all duration-150
          text-primary-600 cursor-pointer
          ${showPillBackground ? 'bg-primary-100' : 'bg-transparent'}
        `}
        aria-label="Open filters"
        aria-expanded={isFilterOpen}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        {/* Active filters badge */}
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-[10px] font-medium text-white flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
}
