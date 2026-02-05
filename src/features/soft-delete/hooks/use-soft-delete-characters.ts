import { useSoftDeleteContext } from '../context/soft-delete-context';
import type { UseSoftDeleteCharactersResult } from '../types/soft-delete.types';

/**
 * Manages soft deletion state for characters.
 * Deleted characters are excluded from all views (list, search, filters).
 * 
 * This hook provides a clean interface for:
 * - Marking characters as deleted (soft delete)
 * - Restoring previously deleted characters
 * - Checking if a character is deleted
 * 
 * State is persisted to localStorage and synced across browser tabs.
 * 
 * @returns Object with soft delete state and actions
 * 
 * @example
 * ```tsx
 * function CharacterCard({ character }: Props) {
 *   const { markAsDeleted, isDeleted } = useSoftDeleteCharacters();
 *   
 *   if (isDeleted(character.id)) {
 *     return null; // Don't render deleted characters
 *   }
 *   
 *   return (
 *     <div>
 *       <span>{character.name}</span>
 *       <button onClick={() => markAsDeleted(character.id)}>
 *         Delete
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSoftDeleteCharacters(): UseSoftDeleteCharactersResult {
  const context = useSoftDeleteContext();

  return {
    deletedCharacterIds: context.deletedIds,
    markAsDeleted: context.markAsDeleted,
    restoreCharacter: context.restoreCharacter,
    isDeleted: context.isDeleted,
    deletedCount: context.deletedCount,
  };
}
