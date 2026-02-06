import type { SortOption } from '@/shared/constants/app.constants';

/**
 * View type for character explorer.
 */
export type ExplorerView = 'all' | 'favorites' | 'deleted';

/**
 * Character type filter for list views.
 */
export type CharacterTypeFilter = 'all' | 'starred' | 'others';

/**
 * Species filter type (consolidated from multiple files).
 */
export type SpeciesType = 'all' | 'Human' | 'Alien';

/**
 * Character type for filters (consolidated).
 */
export type CharacterType = 'all' | 'starred' | 'others';

/**
 * State for character filters in the UI.
 */
export interface CharacterFiltersState {
  readonly name: string;
  readonly status: string;
  readonly species: string;
  readonly gender: string;
  readonly page: number;
  readonly sortBy: SortOption;
  readonly characterType: CharacterTypeFilter;
}
