import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useCharacters } from '../hooks/use-characters';
import { useCharacterFilters } from '../hooks/use-character-filters';
import { useDeletedCharacters } from '../hooks/use-deleted-characters';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { useView } from '../context/view-context';
import { CharacterListPanel } from './character-list-panel';
import { CharacterDetail } from './character-detail';
import { DeletedCharactersList } from './deleted-characters-list';
import { CharacterListItem } from './character-list-item';
import { CharacterListSkeleton } from './character-list-skeleton';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { sortCharactersByName, filterDeletedCharacters } from '../utils/character.utils';
import { getCharacterDetailRoute } from '@/core/config/routes.config';
import { GET_CHARACTERS_BY_IDS } from '../services/character.queries';
import type { CharacterBasic } from '../types/character.types';
import type { CharacterFilter } from '../types/character-query.types';
import type { GetCharactersByIdsQuery } from '../types/character-query.types';

/**
 * Main character explorer component with unified views.
 * Supports three views: all, favorites, deleted with view transitions.
 */
export function CharacterExplorer() {
  const navigate = useNavigate();
  const { view } = useView();
  const { filters, updateFilters, setPage } = useCharacterFilters();
  const { isFavorite, favorites } = useFavorites();
  const { deletedCharacterIds, deletedCount } = useSoftDeleteCharacters();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const apiFilter = useMemo<CharacterFilter>(() => ({
    name: filters.name || undefined,
    status: filters.status || undefined,
    species: filters.species || undefined,
    gender: filters.gender || undefined,
  }), [filters.name, filters.status, filters.species, filters.gender]);

  const { data, loading, error, refetch } = useCharacters({
    page: filters.page,
    filter: apiFilter,
  });

  const favoriteIds = useMemo(() => {
    return [...favorites].filter(id => !deletedCharacterIds.has(id));
  }, [favorites, deletedCharacterIds]);

  const { data: favoritesData, loading: loadingFavorites } = useQuery<GetCharactersByIdsQuery>(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: favoriteIds },
      skip: favoriteIds.length === 0 || view !== 'favorites',
    }
  );

  const favoriteCharacters = favoritesData?.charactersByIds ?? [];

  const {
    deletedCharacters, isLoading: isLoadingDeleted,
    handleRestoreSingle, handleRestoreAll,
  } = useDeletedCharacters(view === 'deleted');

  useEffect(() => { setSelectedCharacterId(null); }, [view]);

  const { starredCharacters, regularCharacters, totalResults } = useMemo(() => {
    if (!data?.characters.results) {
      return { starredCharacters: [], regularCharacters: [], totalResults: 0 };
    }
    const filtered = filterDeletedCharacters(data.characters.results, deletedCharacterIds);
    const characters = filters.sortBy
      ? sortCharactersByName(filtered, filters.sortBy)
      : filtered;
    const starred = characters.filter((c) => isFavorite(c.id));
    const regular = characters.filter((c) => !isFavorite(c.id));
    const showStarred = filters.characterType !== 'others';
    const showRegular = filters.characterType !== 'starred';
    return {
      starredCharacters: showStarred ? starred : [],
      regularCharacters: showRegular ? regular : [],
      totalResults: (showStarred ? starred.length : 0) + (showRegular ? regular.length : 0),
    };
  }, [data?.characters.results, deletedCharacterIds, filters.sortBy, filters.characterType, isFavorite]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.species) count++;
    if (filters.gender) count++;
    if (filters.characterType && filters.characterType !== 'all') count++;
    return count;
  }, [filters.status, filters.species, filters.gender, filters.characterType]);

  const handleCharacterSelect = useCallback((character: CharacterBasic) => {
    setSelectedCharacterId(character.id);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ name: value });
  }, [updateFilters]);

  const handleMobileCharacterClick = useCallback((character: CharacterBasic) => {
    navigate(getCharacterDetailRoute(character.id));
  }, [navigate]);

  if (view === 'all' && loading && !data) {
    return (
      <div className="min-h-[400px] p-4">
        <CharacterListSkeleton count={6} />
      </div>
    );
  }

  if (view === 'all' && error) {
    return (
      <ErrorMessage
        title="Failed to load characters"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen gap-0">
        <div className="w-96 flex-shrink-0 border-r border-gray-100 flex flex-col" style={{ viewTransitionName: 'left-panel' }}>
          {/* CharacterListPanel always renders (contains pills for view switching) */}
          <CharacterListPanel
            starredCharacters={starredCharacters}
            regularCharacters={regularCharacters}
            totalResults={totalResults}
            activeFiltersCount={activeFiltersCount}
            searchValue={filters.name}
            onSearchChange={handleSearchChange}
            onFilterClick={() => setIsFilterOpen((prev) => !prev)}
            isFilterOpen={isFilterOpen}
            onFilterClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterApply={updateFilters}
            selectedCharacterId={selectedCharacterId}
            onCharacterSelect={handleCharacterSelect}
            currentPage={filters.page}
            totalPages={data?.characters.info.pages ?? 1}
            onPageChange={setPage}
          />

          {view === 'favorites' && (
            <div className="flex-1 overflow-y-auto">
              {loadingFavorites ? (
                <div className="p-4"><CharacterListSkeleton count={4} /></div>
              ) : favoriteCharacters.length === 0 ? (
                <EmptyState title="No favorites yet" description="Start exploring characters and add some to your favorites!" />
              ) : (
                <div className="py-2">
                  {favoriteCharacters.map((character) => (
                    <CharacterListItem
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacterId === character.id}
                      onClick={() => handleCharacterSelect(character)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deleted view content */}
          {view === 'deleted' && (
            <div className="flex-1 overflow-y-auto">
              <DeletedCharactersList
                characters={deletedCharacters}
                isLoading={isLoadingDeleted}
                selectedCharacterId={selectedCharacterId}
                onSelect={(c) => setSelectedCharacterId(c.id)}
                onRestore={handleRestoreSingle}
                onRestoreAll={handleRestoreAll}
                deletedCount={deletedCount}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto" style={{ viewTransitionName: 'right-panel' }}>
          {selectedCharacterId ? (
            <CharacterDetail characterId={selectedCharacterId} onBack={() => setSelectedCharacterId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p>Select a character to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* CharacterListPanel always renders (contains pills for view switching) */}
        <CharacterListPanel
          starredCharacters={starredCharacters}
          regularCharacters={regularCharacters}
          totalResults={totalResults}
          activeFiltersCount={activeFiltersCount}
          searchValue={filters.name}
          onSearchChange={handleSearchChange}
          onFilterClick={() => setIsFilterOpen((prev) => !prev)}
          isFilterOpen={isFilterOpen}
          onFilterClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterApply={updateFilters}
          selectedCharacterId={null}
          onCharacterSelect={handleMobileCharacterClick}
          currentPage={filters.page}
          totalPages={data?.characters.info.pages ?? 1}
          onPageChange={setPage}
        />

        {view === 'favorites' && (
          loadingFavorites ? (
            <div className="p-4"><CharacterListSkeleton count={4} /></div>
          ) : favoriteCharacters.length === 0 ? (
            <EmptyState title="No favorites yet" description="Add some characters to favorites!" />
          ) : (
            <div className="py-2">
              {favoriteCharacters.map((character) => (
                <CharacterListItem
                  key={character.id}
                  character={character}
                  onClick={() => handleMobileCharacterClick(character)}
                />
              ))}
            </div>
          )
        )}

        {/* Deleted view content */}
        {view === 'deleted' && (
          <DeletedCharactersList
            characters={deletedCharacters}
            isLoading={isLoadingDeleted}
            selectedCharacterId={null}
            onSelect={(c) => navigate(getCharacterDetailRoute(c.id))}
            onRestore={handleRestoreSingle}
            onRestoreAll={handleRestoreAll}
            deletedCount={deletedCount}
          />
        )}
      </div>
    </div>
  );
}
