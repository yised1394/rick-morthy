import type { CharacterId } from '@/core/types/global.types';

/**
 * Soft delete state containing the set of deleted character IDs.
 */
export interface SoftDeleteState {
  /** Set of character IDs that have been soft deleted */
  readonly deletedIds: ReadonlySet<CharacterId>;
}

/**
 * Actions available for soft delete operations.
 */
export interface SoftDeleteActions {
  /**
   * Marks a character as deleted.
   * Deleted characters are excluded from all views.
   * @param characterId - The ID of the character to delete
   */
  readonly markAsDeleted: (characterId: CharacterId) => void;

  /**
   * Restores a previously deleted character.
   * @param characterId - The ID of the character to restore
   */
  readonly restoreCharacter: (characterId: CharacterId) => void;

  /**
   * Checks if a character is deleted.
   * @param characterId - The ID of the character to check
   * @returns True if the character is deleted, false otherwise
   */
  readonly isDeleted: (characterId: CharacterId) => boolean;
}

/**
 * Combined soft delete context value with state and actions.
 */
export interface SoftDeleteContextValue extends SoftDeleteState, SoftDeleteActions {
  /** Number of deleted characters */
  readonly deletedCount: number;
}

/**
 * Result type for the useSoftDeleteCharacters hook.
 * Provides a clean interface for managing soft deletion state.
 */
export interface UseSoftDeleteCharactersResult {
  /** Read-only set of deleted character IDs */
  readonly deletedCharacterIds: ReadonlySet<CharacterId>;
  
  /** Marks a character as soft deleted */
  readonly markAsDeleted: (characterId: CharacterId) => void;
  
  /** Restores a soft deleted character */
  readonly restoreCharacter: (characterId: CharacterId) => void;
  
  /** Checks if a character is soft deleted */
  readonly isDeleted: (characterId: CharacterId) => boolean;
  
  /** Number of currently deleted characters */
  readonly deletedCount: number;
}
