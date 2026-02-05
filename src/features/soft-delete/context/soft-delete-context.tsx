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
import type { SoftDeleteContextValue } from '../types/soft-delete.types';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';

const SoftDeleteContext = createContext<SoftDeleteContextValue | null>(null);

interface SoftDeleteProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider component for soft delete state management.
 * 
 * Features:
 * - Persists deleted IDs to localStorage
 * - Syncs across browser tabs via storage events
 * - Provides immutable state updates
 * 
 * @example
 * ```tsx
 * <SoftDeleteProvider>
 *   <App />
 * </SoftDeleteProvider>
 * ```
 */
export function SoftDeleteProvider({ children }: SoftDeleteProviderProps) {
  const [deletedIds, setDeletedIds] = useState<Set<CharacterId>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DELETED_CHARACTERS);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      return new Set(parsed.map(createCharacterId));
    } catch {
      return new Set();
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.DELETED_CHARACTERS,
      JSON.stringify([...deletedIds])
    );
  }, [deletedIds]);

  // Sync across browser tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.DELETED_CHARACTERS && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as string[];
          setDeletedIds(new Set(parsed.map(createCharacterId)));
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Marks a character as soft deleted.
   * Uses immutable state update pattern.
   */
  const markAsDeleted = useCallback((characterId: CharacterId) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(characterId);
      return next;
    });
  }, []);

  /**
   * Restores a previously deleted character.
   * Uses immutable state update pattern.
   */
  const restoreCharacter = useCallback((characterId: CharacterId) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.delete(characterId);
      return next;
    });
  }, []);

  /**
   * Checks if a character is currently deleted.
   */
  const isDeleted = useCallback(
    (characterId: CharacterId) => deletedIds.has(characterId),
    [deletedIds]
  );

  const value: SoftDeleteContextValue = {
    deletedIds,
    markAsDeleted,
    restoreCharacter,
    isDeleted,
    deletedCount: deletedIds.size,
  };

  return (
    <SoftDeleteContext.Provider value={value}>
      {children}
    </SoftDeleteContext.Provider>
  );
}

/**
 * Internal hook to access soft delete context.
 * Must be used within a SoftDeleteProvider.
 * 
 * @throws Error if used outside of SoftDeleteProvider
 * @returns The soft delete context value
 */
export function useSoftDeleteContext(): SoftDeleteContextValue {
  const context = useContext(SoftDeleteContext);

  if (!context) {
    throw new Error(
      'useSoftDeleteContext must be used within a SoftDeleteProvider'
    );
  }

  return context;
}
