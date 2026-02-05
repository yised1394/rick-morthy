import { useFavoritesContext } from '../context/favorites-context';

/**
 * Hook to access favorites functionality.
 * Provides access to favorites state and actions.
 *
 * @returns Favorites context value with state and actions
 *
 * @example
 * ```tsx
 * const { favorites, toggleFavorite, isFavorite, count } = useFavorites();
 *
 * // Check if a character is favorite
 * const isRickFavorite = isFavorite(createCharacterId('1'));
 *
 * // Toggle favorite status
 * toggleFavorite(createCharacterId('1'));
 * ```
 */
export function useFavorites() {
  return useFavoritesContext();
}
