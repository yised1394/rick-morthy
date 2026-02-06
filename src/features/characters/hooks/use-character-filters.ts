import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import type { CharacterStatus, CharacterGender } from '../types/character.types';
import type {
  CharacterTypeFilter,
  CharacterFiltersState,
} from '../types/character-filter.types';
import type { SortOption } from '@/shared/constants/app.constants';

/**
 * Hook to manage character filters via URL search params.
 * Keeps filters in URL for shareability and browser history.
 *
 * @returns Object with current filters and update functions
 */
export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CharacterFiltersState = {
    page: Number(searchParams.get('page')) || 1,
    name: searchParams.get('name') ?? '',
    status: (searchParams.get('status') as CharacterStatus) ?? '',
    species: searchParams.get('species') ?? '',
    gender: (searchParams.get('gender') as CharacterGender) ?? '',
    sortBy: (searchParams.get('sortBy') as SortOption) ?? '',
    characterType: (searchParams.get('characterType') as CharacterTypeFilter) || 'all',
  };

  const updateFilters = useCallback(
    (updates: Partial<CharacterFiltersState>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        const hasNonPageUpdate = Object.keys(updates).some((key) => key !== 'page');
        if (hasNonPageUpdate) {
          newParams.set('page', '1');
        }

        Object.entries(updates).forEach(([key, val]) => {
          if (val === undefined || val === '') {
            newParams.delete(key);
          } else {
            newParams.set(key, String(val));
          }
        });

        // Avoid no-op updates that would trigger re-renders
        if (newParams.toString() === prev.toString()) {
          return prev;
        }

        return newParams;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
  };
}
