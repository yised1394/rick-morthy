import { CharacterListItem } from './character-list-item';
import { SearchBar } from './search-bar';
import { FilterDropdown } from './filter-dropdown';
import { FilterMobileSheet } from './filter-mobile-sheet';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import type { CharacterFiltersState } from '../types/character.types';
import type { CharacterBasic } from '../types/character.types';

interface CharacterListPanelProps {
  readonly starredCharacters: readonly CharacterBasic[];
  readonly regularCharacters: readonly CharacterBasic[];
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

/**
 * Desktop left panel for the "all" characters view.
 * Displays search, filters, and starred/regular character lists.
 */
export function CharacterListPanel({
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
  const isMobile = useMediaQuery('(max-width: 1023px)');

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
          {isMobile ? (
            <FilterMobileSheet
              isOpen={isFilterOpen}
              onClose={onFilterClose}
              filters={filters}
              onApply={onFilterApply}
            />
          ) : (
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={onFilterClose}
              filters={filters}
              onApply={onFilterApply}
            />
          )}
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
