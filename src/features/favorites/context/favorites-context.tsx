import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import type { CharacterId } from '@/core/types/global.types';
import type { FavoritesContextValue } from '../types/favorite.types';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';
import { useLocalStorageSet } from '@/shared/hooks/use-local-storage-set';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider component for favorites state management.
 * Syncs with localStorage and handles cross-tab updates.
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useLocalStorageSet(STORAGE_KEYS.FAVORITES);

  const toggleFavorite = useCallback((id: CharacterId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: CharacterId) => favorites.has(id),
    [favorites]
  );

  const value: FavoritesContextValue = {
    favorites,
    toggleFavorite,
    isFavorite,
    count: favorites.size,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to access favorites context.
 * Must be used within a FavoritesProvider.
 */
export function useFavoritesContext(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }

  return context;
}

