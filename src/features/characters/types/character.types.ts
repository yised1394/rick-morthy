import type { CharacterId, EpisodeId } from '@/core/types/global.types';

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
 * Deleted character data for display in deleted view.
 */
export interface DeletedCharacter {
  readonly id: CharacterId;
  readonly name: string;
  readonly image: string;
  readonly species: string;
}
