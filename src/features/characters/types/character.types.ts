import type { CharacterId, EpisodeId, PaginationInfo } from '@/core/types/global.types';
import type { SortOption } from '@/shared/constants/app.constants';

/**
 * Character entity from the Rick and Morty API.
 */
export interface Character {
  readonly id: CharacterId;
  readonly name: string;
  readonly status: CharacterStatus;
  readonly species: string;
  readonly type: string;
  readonly gender: CharacterGender;
  readonly origin: Location;
  readonly location: Location;
  readonly image: string;
  readonly episode: readonly Episode[];
  readonly created: string;
}

/**
 * Simplified character for list views.
 */
export interface CharacterBasic {
  readonly id: CharacterId;
  readonly name: string;
  readonly image: string;
  readonly species: string;
  readonly status: CharacterStatus;
  readonly gender: CharacterGender;
}

/**
 * Character status type.
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/**
 * Character gender type.
 */
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/**
 * Location reference.
 */
export interface Location {
  readonly name: string;
  readonly dimension?: string;
}

/**
 * Episode reference.
 */
export interface Episode {
  readonly id: EpisodeId;
  readonly name: string;
  readonly episode: string;
}

/**
 * Filter options for character queries.
 */
export interface CharacterFilter {
  readonly name?: string;
  readonly status?: CharacterStatus;
  readonly species?: string;
  readonly gender?: CharacterGender;
}

/**
 * GraphQL query response for characters list.
 */
export interface GetCharactersQuery {
  readonly characters: {
    readonly info: PaginationInfo;
    readonly results: readonly CharacterBasic[];
  };
}

/**
 * GraphQL query variables for characters list.
 */
export interface GetCharactersQueryVariables {
  readonly page: number;
  readonly filter?: CharacterFilter;
}

/**
 * GraphQL query response for single character.
 */
export interface GetCharacterByIdQuery {
  readonly character: Character | null;
}

/**
 * GraphQL query variables for single character.
 */
export interface GetCharacterByIdQueryVariables {
  readonly id: string;
}

/**
 * GraphQL query response for fetching characters by IDs.
 */
export interface GetCharactersByIdsQuery {
  readonly charactersByIds: readonly CharacterBasic[];
}

/**
 * View types for the character explorer.
 */
export type ExplorerView = 'all' | 'favorites' | 'deleted';

/**
 * Character type filter for starred/others filtering.
 */
export type CharacterTypeFilter = 'all' | 'starred' | 'others';

/**
 * State for character filters managed via URL search params.
 */
export interface CharacterFiltersState {
  readonly page: number;
  readonly name: string;
  readonly status: CharacterStatus | '';
  readonly species: string;
  readonly gender: CharacterGender | '';
  readonly sortBy: SortOption | '';
  readonly characterType: CharacterTypeFilter;
}

/**
 * Deleted character data for display in deleted view.
 */
export interface DeletedCharacter {
  readonly id: CharacterId;
  readonly name: string;
  readonly image: string;
  readonly species: string;
}
