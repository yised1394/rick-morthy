import { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { CHARACTER_STATUS, CHARACTER_GENDER } from '@/shared/constants/app.constants';
import type { CharacterFiltersState } from '../types/character-filter.types';

interface CharacterFiltersProps {
  readonly filters: CharacterFiltersState;
  readonly onFilterChange: (updates: Partial<CharacterFiltersState>) => void;
  readonly onReset: () => void;
}

/**
 * Filter controls for character list.
 */
export function CharacterFilters({
  filters,
  onFilterChange,
  onReset,
}: CharacterFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.name);
  // Increased to 1200ms to prevent API rate limiting (429)
  const debouncedSearch = useDebounce(searchInput, 1200);

  useEffect(() => {
    if (debouncedSearch !== filters.name) {
      onFilterChange({ name: debouncedSearch });
    }
  }, [debouncedSearch, filters.name, onFilterChange]);

  const hasActiveFilters =
    filters.name || filters.status || filters.species || filters.gender;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-auto">
        <Input
          label="Search"
          placeholder="Character name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <div className="w-full sm:w-auto">
        <label
          htmlFor="status-filter"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value as CharacterFiltersState['status'] })}
          className="input w-full sm:w-32"
        >
          <option value="">All</option>
          {CHARACTER_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label
          htmlFor="gender-filter"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Gender
        </label>
        <select
          id="gender-filter"
          value={filters.gender}
          onChange={(e) => onFilterChange({ gender: e.target.value as CharacterFiltersState['gender'] })}
          className="input w-full sm:w-32"
        >
          <option value="">All</option>
          {CHARACTER_GENDER.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <Input
          label="Species"
          placeholder="e.g. Human"
          value={filters.species}
          onChange={(e) => onFilterChange({ species: e.target.value })}
          className="w-full sm:w-32"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}