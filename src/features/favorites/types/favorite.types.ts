import type { CharacterId } from '@/core/types/global.types';

/**
 * Favorites context state.
 */
export interface FavoritesState {
  readonly favorites: Set<CharacterId>;
}

/**
 * Favorites context actions.
 */
export interface FavoritesActions {
  readonly toggleFavorite: (id: CharacterId) => void;
  readonly isFavorite: (id: CharacterId) => boolean;
}

/**
 * Combined favorites context value.
 */
export interface FavoritesContextValue extends FavoritesState, FavoritesActions {
  readonly count: number;
}

