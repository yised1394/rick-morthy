import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon } from '@/shared/components/icons/search-icon';
import { FilterIcon } from '@/shared/components/icons/filter-icon';

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onFilterClick: () => void;
  readonly placeholder?: string;
  readonly activeFiltersCount?: number;
  readonly isFilterOpen?: boolean;
}

const DEBOUNCE_DELAY = 800;

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const showPillBackground = isFilterOpen || isFilterHovered;

  // Sync external value changes (e.g. filter reset) only when user is not typing
  useEffect(() => {
    if (!timerRef.current) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onChangeRef.current(newValue);
    }, DEBOUNCE_DELAY);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 pointer-events-none">
        <SearchIcon className="text-gray-400" size={20} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
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
        <FilterIcon size={20} />
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
