import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { toast } from 'sonner';
import { useCharacters } from '../hooks/use-characters';
import { useCharacterFilters } from '../hooks/use-character-filters';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useSoftDeleteCharacters } from '@/features/soft-delete';
import { useView } from '../context';
import { CharacterListItem } from './character-list-item';
import { CharacterDetail } from './character-detail';
import { SearchBar } from './search-bar';
import { FilterDropdown } from './filter-dropdown';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { sortCharactersByName, filterDeletedCharacters } from '../utils/character.utils';
import { getCharacterDetailRoute } from '@/core/config/routes.config';
import type { CharacterFiltersState } from '../hooks/use-character-filters';
import type { CharacterFilter, CharacterBasic } from '../types/character.types';
import type { CharacterId } from '@/core/types/global.types';

// GraphQL query for fetching characters by IDs (for favorites)
const GET_CHARACTERS_BY_IDS = gql`
  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      image
      species
      status
      gender
    }
  }
`;

interface DeletedCharacter {
  readonly id: CharacterId;
  readonly name: string;
  readonly image: string;
  readonly species: string;
}

/**
 * Main character explorer component with unified views.
 * Supports three views: all, favorites, deleted with view transitions.
 */
export function CharacterExplorer() {
  const navigate = useNavigate();
  const { view, setView } = useView();
  const { filters, updateFilters } = useCharacterFilters();
  const { isFavorite, favorites } = useFavorites();
  const { deletedCharacterIds, restoreCharacter, deletedCount } = useSoftDeleteCharacters();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // API filter for main characters
  const apiFilter: CharacterFilter = {
    name: filters.name || undefined,
    status: filters.status || undefined,
    species: filters.species || undefined,
    gender: filters.gender || undefined,
  };

  // Main characters query
  const { data, loading, error, refetch } = useCharacters({
    page: filters.page,
    filter: apiFilter,
  });

  // Favorites query - filter out deleted
  const favoriteIds = useMemo(() => {
    return [...favorites].filter(id => !deletedCharacterIds.has(id as CharacterId));
  }, [favorites, deletedCharacterIds]);

  const { data: favoritesData, loading: loadingFavorites } = useQuery(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: favoriteIds },
      skip: favoriteIds.length === 0 || view !== 'favorites',
    }
  );

  // Fetch deleted characters when in deleted view
  useEffect(() => {
    if (view !== 'deleted' || deletedCount === 0) {
      setDeletedCharacters([]);
      return;
    }

    const fetchDeletedCharacters = async () => {
      setIsLoadingDeleted(true);
      try {
        const ids = Array.from(deletedCharacterIds);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${ids.join(',')}`
        );
        const data = await response.json();
        const characters = Array.isArray(data) ? data : [data];
        setDeletedCharacters(
          characters.map((char: { id: number; name: string; image: string; species: string }) => ({
            id: String(char.id) as CharacterId,
            name: char.name,
            image: char.image,
            species: char.species,
          }))
        );
      } catch {
        setDeletedCharacters([]);
      } finally {
        setIsLoadingDeleted(false);
      }
    };

    void fetchDeletedCharacters();
  }, [view, deletedCharacterIds, deletedCount]);

  // Clear selection when view changes
  useEffect(() => {
    setSelectedCharacterId(null);
  }, [view]);

  // Process characters for "all" view
  const { starredCharacters, regularCharacters, totalResults } = useMemo(() => {
    if (!data?.characters.results) {
      return { starredCharacters: [], regularCharacters: [], totalResults: 0 };
    }

    const filtered = filterDeletedCharacters(data.characters.results, deletedIds);
    const characters = filters.sortBy
      ? sortCharactersByName(filtered, filters.sortBy)
      : filtered;

    const starred = characters.filter((c) => isFavorite(c.id));
    const regular = characters.filter((c) => !isFavorite(c.id));

    // Apply characterType filter
    const showStarred = filters.characterType !== 'others';
    const showRegular = filters.characterType !== 'starred';

    const visibleStarred = showStarred ? starred : [];
    const visibleRegular = showRegular ? regular : [];

    return {
      starredCharacters: visibleStarred,
      regularCharacters: visibleRegular,
      totalResults: visibleStarred.length + visibleRegular.length,
    };
  }, [data?.characters.results, deletedIds, filters.sortBy, filters.characterType, isFavorite]);

  // Favorites list
  const favoriteCharacters = useMemo(() => {
    return (favoritesData?.charactersByIds ?? []) as CharacterBasic[];
  }, [favoritesData]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.species) count++;
    if (filters.gender) count++;
    if (filters.characterType && filters.characterType !== 'all') count++;
    return count;
  }, [filters.status, filters.species, filters.gender, filters.characterType]);

  const handleCharacterSelect = useCallback((character: CharacterBasic | DeletedCharacter) => {
    setSelectedCharacterId(character.id);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ name: value });
  }, [updateFilters]);

  const handleMobileCharacterClick = useCallback((character: CharacterBasic) => {
    navigate(getCharacterDetailRoute(character.id));
  }, [navigate]);

  const handleRestoreSingle = useCallback((character: DeletedCharacter) => {
    restoreCharacter(character.id);
    toast.success(`${character.name} restored`, {
      description: 'The character is now visible in the list.',
    });
  }, [restoreCharacter]);

  const handleRestoreAll = useCallback(() => {
    const count = deletedCharacters.length;
    deletedCharacters.forEach(c => restoreCharacter(c.id));
    toast.success(`All ${count} characters restored`, {
      description: 'All characters are now visible in the list.',
    });
  }, [deletedCharacters, restoreCharacter]);

  // Get view title
  const getViewTitle = () => {
    switch (view) {
      case 'favorites': return 'Favorites';
      case 'deleted': return 'Deleted';
      default: return 'Rick and Morty list';
    }
  };

  // Loading state for main view
  if (view === 'all' && loading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
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
      <div className="hidden lg:flex h-[calc(100vh-200px)] gap-0">
        {/* Left Panel - Character List */}
        <div className="w-96 flex-shrink-0 border-r border-gray-100 flex flex-col">
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
          />
        </div>

        {/* Right Panel - Character Detail */}
        <div className="flex-1 overflow-y-auto" style={{ viewTransitionName: 'right-panel' }}>
          {selectedCharacterId ? (
            <CharacterDetail
              characterId={selectedCharacterId}
              onBack={() => setSelectedCharacterId(null)}
            />
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
        <MobileCharacterList
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
          onCharacterClick={handleMobileCharacterClick}
        />
      </div>
    </div>
  );
}

interface CharacterListPanelProps {
  readonly starredCharacters: CharacterBasic[];
  readonly regularCharacters: CharacterBasic[];
  readonly totalResults: number;
  readonly activeFiltersCount: number;
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly onFilterClick: () => void;
  readonly isFilterOpen: boolean;
  readonly onFilterClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onFilterApply: (filters: Partial<CharacterFiltersState>) => void;
  readonly selectedCharacterId: string | null;
  readonly onCharacterSelect: (character: CharacterBasic) => void;
}

function CharacterListPanel({
  starredCharacters,
  regularCharacters,
  totalResults,
  activeFiltersCount,
  searchValue,
  onSearchChange,
  onFilterClick,
  isFilterOpen,
  onFilterClose,
  filters,
  onFilterApply,
  selectedCharacterId,
  onCharacterSelect,
}: CharacterListPanelProps) {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Rick and Morty list</h1>
        <div className="relative w-full max-w-[343px]">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onFilterClick={onFilterClick}
            activeFiltersCount={activeFiltersCount}
            isFilterOpen={isFilterOpen}
          />
          <FilterDropdown
            isOpen={isFilterOpen}
            onClose={onFilterClose}
            filters={filters}
            onApply={onFilterApply}
          />
        </div>
      </div>

      {/* Results count and filter badge */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-[#2563EB] font-medium">
          {totalResults} Results
        </span>
        {activeFiltersCount > 0 && (
          <span className="px-3 py-1 text-xs font-medium bg-[#63D83833] text-[#3B8520] rounded-full">
            {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

        {/* Mobile content based on view */}
        {view === 'all' && (
          <>
            {totalResults === 0 ? (
              <EmptyState title="No characters found" description="Try adjusting your filters" />
            ) : (
              <>
                {starredCharacters.length > 0 && (
                  <div className="py-2">
                    <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Starred Characters ({starredCharacters.length})
                    </h2>
                    {starredCharacters.map((character) => (
                      <CharacterListItem
                        key={character.id}
                        character={character}
                        onClick={() => handleMobileCharacterClick(character)}
                      />
                    ))}
                  </div>
                )}
                {regularCharacters.length > 0 && (
                  <div className="py-2">
                    <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Characters ({regularCharacters.length})
                    </h2>
                    {regularCharacters.map((character) => (
                      <CharacterListItem
                        key={character.id}
                        character={character}
                        onClick={() => handleMobileCharacterClick(character)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

function CharacterDetailPanel({ character }: CharacterDetailPanelProps) {
  return (
    <div>
      {/* Avatar with favorite indicator */}
      <div className="relative inline-block mb-4">
        <img
          src={character.image}
          alt={character.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1">
          <FavoriteButton
            characterId={character.id}
            size="sm"
            variant="minimal"
          />
        </div>
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {character.name}
      </h2>

      {/* Info sections */}
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-4">
          <dt className="text-sm font-semibold text-gray-800 mb-1">Specie</dt>
          <dd className="text-sm text-gray-500">{character.species}</dd>
        </div>
        <div className="border-b border-gray-100 pb-4">
          <dt className="text-sm font-semibold text-gray-800 mb-1">Status</dt>
          <dd className="text-sm text-gray-500">{character.status}</dd>
        </div>
        <div className="border-b border-gray-100 pb-4">
          <dt className="text-sm font-semibold text-gray-800 mb-1">Occupation</dt>
          <dd className="text-sm text-gray-500">{character.type || 'Princess'}</dd>
        </div>
      </div>
    </div>
  );
}

interface MobileCharacterListProps {
  readonly starredCharacters: CharacterBasic[];
  readonly regularCharacters: CharacterBasic[];
  readonly totalResults: number;
  readonly activeFiltersCount: number;
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly onFilterClick: () => void;
  readonly isFilterOpen: boolean;
  readonly onFilterClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onFilterApply: (filters: Partial<CharacterFiltersState>) => void;
  readonly onCharacterClick: (character: CharacterBasic) => void;
}

function MobileCharacterList({
  starredCharacters,
  regularCharacters,
  totalResults,
  activeFiltersCount,
  searchValue,
  onSearchChange,
  onFilterClick,
  isFilterOpen,
  onFilterClose,
  filters,
  onFilterApply,
  onCharacterClick,
}: MobileCharacterListProps) {
  return (
    <div>
      {/* Header */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Rick and Morty list</h1>
        <div className="relative w-full max-w-[343px]">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onFilterClick={onFilterClick}
            activeFiltersCount={activeFiltersCount}
            isFilterOpen={isFilterOpen}
          />
          <FilterDropdown
            isOpen={isFilterOpen}
            onClose={onFilterClose}
            filters={filters}
            onApply={onFilterApply}
          />
        </div>
      </div>

      {/* Character lists */}
      <div>
        {totalResults === 0 ? (
          <EmptyState
            title="No characters found"
            description="Try adjusting your filters"
          />
        ) : (
          <>
            {loadingFavorites ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
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
            )}
          </>
        )}

        {view === 'deleted' && (
          <>
            {isLoadingDeleted ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : deletedCharacters.length === 0 ? (
              <EmptyState title="No deleted characters" description="Deleted characters appear here." />
            ) : (
              <div className="space-y-2 p-4">
                {deletedCharacters.map((character) => (
                  <div key={character.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <img src={character.image} alt={character.name} className="w-10 h-10 rounded-full opacity-60" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-600 truncate">{character.name}</h3>
                      <p className="text-xs text-gray-400 truncate">{character.species}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreSingle(character)}
                      className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={updateFilters}
      />
    </div>
  );
}
