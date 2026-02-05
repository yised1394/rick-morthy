import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import type { CharacterStatus, CharacterGender } from '../types/character.types';
import type { SortOption } from '@/shared/constants/app.constants';

export interface CharacterFiltersState {
  readonly page: number;
  readonly name: string;
  readonly status: CharacterStatus | '';
  readonly species: string;
  readonly gender: CharacterGender | '';
  readonly sortBy: SortOption | '';
}

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
  };

  const updateFilters = useCallback(
    (updates: Partial<CharacterFiltersState>) => {
      const newParams = new URLSearchParams(searchParams);

      if (Object.keys(updates).some((key) => key !== 'page')) {
        newParams.set('page', '1');
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
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
