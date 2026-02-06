import { CharacterListItem } from './character-list-item';
import { SearchBar } from './search-bar';
import { FilterDropdown } from './filter-dropdown';
import { FilterMobileSheet } from './filter-mobile-sheet';
import { Pagination } from './pagination';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { SORT_OPTIONS } from '@/shared/constants/app.constants';
import { useView } from '../context/view-context';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { CloseIcon } from '@/shared/components/icons/close-icon';
import type { CharacterFiltersState } from '../types/character-filter.types';
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
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

/**
 * Left panel for the character list view.
 * Displays title, view pills, search, filters, and character lists with inline footer.
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
  currentPage,
  totalPages,
  onPageChange,
}: CharacterListPanelProps) {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { view, setView } = useView();
  const { count: favoritesCount } = useFavorites();
  const { deletedCount } = useSoftDeleteCharacters();

  return (
    <>
      {/* Header with title and view pills */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Rick and Morty list</h1>

        {/* View pills */}
        <div className="flex gap-2 mb-4">
          <ViewPill
            label="All"
            active={view === 'all'}
            onClick={() => setView('all')}
          />
          <ViewPill
            label="Starred"
            count={favoritesCount}
            active={view === 'favorites'}
            onClick={() => setView('favorites')}
          />
          <ViewPill
            label="Deleted"
            count={deletedCount}
            active={view === 'deleted'}
            onClick={() => setView('deleted')}
          />
        </div>

        {view === 'all' && (
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
        )}
      </div>

      {view === 'all' && (
        <>
          {/* Results count, sort and filter badge */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-[#2563EB] font-medium">
              {totalResults} Results
            </span>
            <div className="flex items-center gap-2">
              <SortButton
                sortBy={filters.sortBy}
                onToggle={() => {
                  const next = !filters.sortBy
                    ? SORT_OPTIONS.NAME_ASC
                    : filters.sortBy === SORT_OPTIONS.NAME_ASC
                      ? SORT_OPTIONS.NAME_DESC
                      : '';
                  onFilterApply({ sortBy: next || ('' as CharacterFiltersState['sortBy']) });
                }}
              />
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterApply({ characterType: 'all', species: '' })}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#63D83833] text-[#3B8520] rounded-full transition-all hover:bg-[#63D83855] active:scale-95"
                  aria-label="Clear all filters"
                >
                  {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
                  <CloseIcon size={12} />
                </button>
              )}
            </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}

            {/* Inline footer */}
            <ListFooter />
          </div>
        </>
      )}
    </>
  );
}

/* ── View pill ────────────────────────────────────────── */

interface ViewPillProps {
  readonly label: string;
  readonly count?: number;
  readonly active: boolean;
  readonly onClick: () => void;
}

function ViewPill({ label, count, active, onClick }: ViewPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3.5 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 border
        ${active
          ? 'bg-purple-50 text-purple-600 border-purple-200'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`
            ml-1.5 px-1.5 py-0.5 rounded-md text-xs font-semibold
            ${active ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Sort button ──────────────────────────────────────── */

import type { SortOption } from '@/shared/constants/app.constants';

interface SortButtonProps {
  readonly sortBy: SortOption | '';
  readonly onToggle: () => void;
}

function SortButton({ sortBy, onToggle }: SortButtonProps) {
  const label = !sortBy ? 'Sort' : sortBy === SORT_OPTIONS.NAME_ASC ? 'A-Z' : 'Z-A';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all
        ${sortBy
          ? 'bg-primary-100 text-primary-600'
          : 'text-gray-500 hover:bg-gray-100'
        }
      `}
      aria-label={`Sort by name: ${label}`}
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      {label}
    </button>
  );
}

/* ── Inline footer ────────────────────────────────────── */

function ListFooter() {
  return (
    <footer className="mt-10 pt-6 pb-4 border-t border-gray-100 text-center">
      <p className="text-[13px] text-gray-400 leading-relaxed">
        Data from{' '}
        <a
          href="https://rickandmortyapi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline transition-colors"
        >
          Rick and Morty API
        </a>
      </p>
    </footer>
  );
}
