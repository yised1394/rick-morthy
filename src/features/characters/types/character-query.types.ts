import type { CharacterId, PaginationInfo } from '@/core/types/global.types';
import type { Character } from './character.types';

/**
 * GraphQL query for fetching characters with pagination.
 */
export interface GetCharactersQuery {
  readonly characters: {
    readonly info: PaginationInfo;
    readonly results: readonly Character[];
  };
}

/**
 * Variables for the GetCharacters query.
 */
export interface GetCharactersQueryVariables {
  readonly page?: number;
  readonly filter?: CharacterFilter;
}

/**
 * GraphQL query for fetching a single character by ID.
 */
export interface GetCharacterByIdQuery {
  readonly character: Character | null;
}

/**
 * Variables for the GetCharacterById query.
 */
export interface GetCharacterByIdQueryVariables {
  readonly id: CharacterId;
}

/**
 * GraphQL query for fetching multiple characters by IDs.
 */
export interface GetCharactersByIdsQuery {
  readonly charactersByIds: readonly Character[];
}

/**
 * Filter criteria for character queries.
 */
export interface CharacterFilter {
  readonly name?: string;
  readonly status?: string;
  readonly species?: string;
  readonly gender?: string;
}
