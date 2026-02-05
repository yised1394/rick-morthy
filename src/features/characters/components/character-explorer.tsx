import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../hooks/use-characters';
import { useCharacterFilters } from '../hooks/use-character-filters';
import { useCharacterById } from '../hooks/use-character-by-id';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { CharacterListItem } from './character-list-item';
import { SearchBar } from './search-bar';
import { FilterDropdown } from './filter-dropdown';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { sortCharactersByName, filterDeletedCharacters } from '../utils/character.utils';
import { getCharacterDetailRoute } from '@/core/config/routes.config';
import type { CharacterFiltersState } from '../hooks/use-character-filters';
import type { CharacterFilter, CharacterBasic } from '../types/character.types';
import type { CharacterId } from '@/core/types/global.types';

/**
 * Main character explorer component with Figma design.
 * Features:
 * - List view with starred/regular sections
 * - Search bar with filter button
 * - Split layout on desktop (list + detail)
 * - Mobile-first responsive design
 */
export function CharacterExplorer() {
  const navigate = useNavigate();
  const { filters, updateFilters } = useCharacterFilters();
  const { deletedIds, isFavorite } = useFavorites();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // API filter
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

  // Get selected character details
  const { data: selectedCharacterData } = useCharacterById(selectedCharacterId ?? '');

  // Process characters into starred and regular lists
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

  // Count active filters
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

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Failed to load characters"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  const selectedCharacter = selectedCharacterData?.character;

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
        <div className="flex-1 overflow-y-auto p-8">
          {selectedCharacter ? (
            <CharacterDetailPanel character={selectedCharacter} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
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

      {/* Character lists */}
      <div className="flex-1 overflow-y-auto">
        {totalResults === 0 ? (
          <EmptyState
            title="No characters found"
            description="Try adjusting your filters"
          />
        ) : (
          <>
            {/* Starred characters section */}
            {starredCharacters.length > 0 && (
              <div className="py-2">
                <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Starred Characters ({starredCharacters.length})
                </h2>
                {starredCharacters.map((character) => (
                  <CharacterListItem
                    key={character.id}
                    character={character}
                    isSelected={selectedCharacterId === character.id}
                    onClick={() => onCharacterSelect(character)}
                  />
                ))}
              </div>
            )}

            {/* Regular characters section */}
            {regularCharacters.length > 0 && (
              <div className="py-2">
                <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Characters ({regularCharacters.length})
                </h2>
                {regularCharacters.map((character) => (
                  <CharacterListItem
                    key={character.id}
                    character={character}
                    isSelected={selectedCharacterId === character.id}
                    onClick={() => onCharacterSelect(character)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

interface CharacterDetailPanelProps {
  character: {
    id: CharacterId;
    name: string;
    image: string;
    species: string;
    status: string;
    type: string;
  };
}

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
            {/* Starred characters section */}
            {starredCharacters.length > 0 && (
              <div className="py-2">
                <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Starred Characters ({starredCharacters.length})
                </h2>
                {starredCharacters.map((character) => (
                  <CharacterListItem
                    key={character.id}
                    character={character}
                    onClick={() => onCharacterClick(character)}
                  />
                ))}
              </div>
            )}

            {/* Regular characters section */}
            {regularCharacters.length > 0 && (
              <div className="py-2">
                <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Characters ({regularCharacters.length})
                </h2>
                {regularCharacters.map((character) => (
                  <CharacterListItem
                    key={character.id}
                    character={character}
                    onClick={() => onCharacterClick(character)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
