import { useMemo } from 'react';
import { useCharacters } from '../hooks/use-characters';
import { useCharacterFilters } from '../hooks/use-character-filters';
import { CharacterCard } from './character-card';
import { CharacterFilters } from './character-filters';
import { CharacterSort } from './character-sort';
import { Pagination } from './pagination';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { sortCharactersByName, filterDeletedCharacters } from '../utils/character.utils';
import type { CharacterFilter } from '../types/character-query.types';

/**
 * Main character list component with filtering, sorting, and pagination.
 */
export function CharacterList() {
  const { filters, updateFilters, resetFilters, setPage } = useCharacterFilters();
  const { deletedCharacterIds } = useSoftDeleteCharacters();

  const apiFilter: CharacterFilter = {
    name: filters.name || undefined,
    status: filters.status || undefined,
    species: filters.species || undefined,
    gender: filters.gender || undefined,
  };

  const { data, loading, error, refetch } = useCharacters({
    page: filters.page,
    filter: apiFilter,
  });

  const processedCharacters = useMemo(() => {
    if (!data?.characters.results) return [];

    let characters = filterDeletedCharacters(
      data.characters.results,
      deletedCharacterIds as ReadonlySet<string>
    );

    if (filters.sortBy) {
      characters = sortCharactersByName(characters, filters.sortBy);
    }

    return characters;
  }, [data?.characters.results, deletedCharacterIds, filters.sortBy]);

  if (loading && !data) {
    return null; 
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load characters"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CharacterFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />
        <CharacterSort
          value={filters.sortBy}
          onChange={(sortBy) => updateFilters({ sortBy: sortBy || undefined })}
        />
      </div>

      {processedCharacters.length === 0 ? (
        <EmptyState
          title="No characters found"
          description="Try adjusting your filters or search criteria"
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {processedCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          {data?.characters.info && (
            <Pagination
              currentPage={filters.page}
              totalPages={data.characters.info.pages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
