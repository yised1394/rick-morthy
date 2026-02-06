import type { CharacterId } from '@/core/types/global.types';
import type { Character, CharacterBasic, DeletedCharacter } from './character.types';
import type { CharacterFiltersState, ExplorerView } from './character-filter.types';

/**
 * Props for SearchBar component.
 */
export interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly activeFiltersCount?: number;
  readonly isFilterOpen: boolean;
  readonly onFilterToggle: () => void;
}

/**
 * Props for Pagination component.
 */
export interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

/**
 * Props for FilterModal component.
 */
export interface FilterModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onApply: (filters: Partial<CharacterFiltersState>) => void;
}

/**
 * Props for FilterMobileSheet component.
 */
export interface FilterMobileSheetProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onApply: (filters: Partial<CharacterFiltersState>) => void;
}

/**
 * Props for FilterDropdown component.
 */
export interface FilterDropdownProps {
  readonly filters: CharacterFiltersState;
  readonly onApply: (filters: Partial<CharacterFiltersState>) => void;
}

/**
 * Props for DeletedCharactersList component.
 */
export interface DeletedCharactersListProps {
  readonly characters: readonly DeletedCharacter[];
  readonly onRestore: (id: CharacterId) => void;
  readonly onRestoreAll: () => void;
  readonly isLoading: boolean;
  readonly deletedCount: number;
}

/**
 * Props for CharacterSort component.
 */
export interface CharacterSortProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

/**
 * Props for CharacterListPanel component.
 */
export interface CharacterListPanelProps {
  readonly characters: readonly CharacterBasic[];
  readonly starredCharacters: readonly CharacterBasic[];
  readonly totalResults: number;
  readonly loading: boolean;
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
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
 * Props for CharacterListItem component.
 */
export interface CharacterListItemProps {
  readonly character: CharacterBasic;
  readonly isSelected?: boolean;
  readonly onClick: (character: CharacterBasic) => void;
}

/**
 * Props for CharacterCard component.
 */
export interface CharacterCardProps {
  readonly character: CharacterBasic;
}

/**
 * Props for CharacterDetail component.
 */
export interface CharacterDetailProps {
  readonly characterId: CharacterId;
}

/**
 * Props for ViewPill component.
 */
export interface ViewPillProps {
  readonly view: ExplorerView;
  readonly label: string;
  readonly count: number;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

/**
 * Props for SortButton component.
 */
export interface SortButtonProps {
  readonly sortBy: string;
  readonly onSortChange: (value: string) => void;
}

/**
 * Props for FilterChip component.
 */
export interface FilterChipProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

/**
 * Props for MobileFilterChip component.
 */
export interface MobileFilterChipProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

/**
 * Props for CharacterFilters component.
 */
export interface CharacterFiltersProps {
  readonly filters: CharacterFiltersState;
  readonly onFilterChange: (filters: Partial<CharacterFiltersState>) => void;
  readonly onReset: () => void;
}

/**
 * Props for CharacterInfoRow component.
 */
export interface CharacterInfoRowProps {
  readonly label: string;
  readonly value: string;
}

/**
 * Props for MobileInfoSection component.
 */
export interface MobileInfoSectionProps {
  readonly character: Character;
}

/**
 * Props for CharacterListSkeleton component.
 */
export interface CharacterListSkeletonProps {
  readonly count?: number;
}

/**
 * Props for DeletedSkeleton component.
 */
export interface DeletedSkeletonProps {
  readonly count?: number;
}
