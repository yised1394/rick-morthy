import type { SortOption } from '@/shared/constants/app.constants';

export type ExplorerView = 'all' | 'favorites' | 'deleted';

export type CharacterTypeFilter = 'all' | 'starred' | 'others';

/**
 * Species filter options for character filtering.
 */
export type SpeciesType = 'all' | 'Human' | 'Alien';

/**
 * Character type classification for filtering.
 */
export type CharacterType = 'all' | 'starred' | 'others';

/**
 * Character filter state for the UI.
 * @property name - Character name search filter
 * @property status - Character status filter (Alive, Dead, unknown)
 * @property species - Species type filter
 * @property gender - Gender filter
 * @property page - Current page number
 * @property sortBy - Sort option
 * @property characterType - Character type classification
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
