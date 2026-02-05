import type { CharacterBasic } from '../types/character.types';
import type { SortOption } from '@/shared/constants/app.constants';
import { SORT_OPTIONS } from '@/shared/constants/app.constants';

/**
 * Sort characters by name.
 *
 * @param characters - Array of characters to sort
 * @param order - Sort order (asc or desc)
 * @returns Sorted array of characters
 */
export function sortCharactersByName<T extends CharacterBasic>(
  characters: readonly T[],
  order: SortOption
): T[] {
  return [...characters].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === SORT_OPTIONS.NAME_ASC ? comparison : -comparison;
  });
}

/**
 * Filter out deleted characters from a list.
 *
 * @param characters - Array of characters
 * @param deletedIds - Set of deleted character IDs (supports ReadonlySet)
 * @returns Filtered array without deleted characters
 */
export function filterDeletedCharacters<T extends CharacterBasic>(
  characters: readonly T[],
  deletedIds: ReadonlySet<string>
): T[] {
  return characters.filter((char) => !deletedIds.has(char.id));
}

/**
 * Get status color class for a character.
 *
 * @param status - Character status
 * @returns CSS class for the status color
 */
export function getStatusColorClass(status: string): string {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'alive') return 'bg-success';
  if (normalizedStatus === 'dead') return 'bg-danger';
  return 'bg-neutral-400';
}

/**
 * Format character creation date.
 *
 * @param created - ISO date string
 * @returns Formatted date string
 */
export function formatCharacterDate(created: string): string {
  return new Date(created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
