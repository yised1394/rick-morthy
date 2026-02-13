import { useState, useEffect } from 'react';
import type { CharacterId } from '@/core/types/global.types';
import { createCharacterId } from '@/core/types/global.types';

/**
 * Hook for managing a Set of CharacterIds synchronized with localStorage.
 * Handles cross-tab synchronization automatically.
 *
 * @param key - localStorage key to store the Set
 * @param initialValue - Initial Set value if key doesn't exist (default: empty Set)
 * @returns Tuple of [set, setState] like useState
 *
 * @example
 * ```tsx
 * const [favorites, setFavorites] = useLocalStorageSet(STORAGE_KEYS.FAVORITES);
 * 
 * // Add to Set
 * setFavorites((prev) => {
 *   const next = new Set(prev);
 *   next.add(characterId);
 *   return next;
 * });
 * ```
 */
export function useLocalStorageSet(
  key: string,
  initialValue: Set<CharacterId> = new Set()
): [Set<CharacterId>, (setter: (prev: Set<CharacterId>) => Set<CharacterId>) => void] {
  // Initialize state from localStorage or use initial value
  const [state, setState] = useState<Set<CharacterId>>(() => {
    try {
      const stored = localStorage.getItem(key);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      return new Set(parsed.map(createCharacterId));
    } catch {
      return initialValue;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...state]));
  }, [key, state]);

  // Sync across browser tabs via storage event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as string[];
          setState(new Set(parsed.map(createCharacterId)));
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setState];
}
