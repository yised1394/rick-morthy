import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for syncing state with localStorage.
 * Automatically handles JSON serialization and cross-tab sync.
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue] like useState
 *
 * @example
 * ```tsx
 * const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;

        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }

        return valueToStore;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
