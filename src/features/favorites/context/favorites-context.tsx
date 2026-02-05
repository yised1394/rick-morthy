import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { CharacterId } from '@/core/types/global.types';
import { createCharacterId } from '@/core/types/global.types';
import type { FavoritesContextValue } from '../types/favorite.types';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider component for favorites state management.
 * Syncs with localStorage and handles cross-tab updates.
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Set<CharacterId>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      return new Set(parsed.map(createCharacterId));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.FAVORITES && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as string[];
          setFavorites(new Set(parsed.map(createCharacterId)));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

