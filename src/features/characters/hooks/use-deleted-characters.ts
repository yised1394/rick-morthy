import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import type { CharacterId } from '@/core/types/global.types';
import type { DeletedCharacter } from '../types/character.types';

interface UseDeletedCharactersResult {
  readonly deletedCharacters: readonly DeletedCharacter[];
  readonly isLoading: boolean;
  readonly handleRestoreSingle: (character: DeletedCharacter) => void;
  readonly handleRestoreAll: () => void;
}

/**
 * Hook to fetch and manage deleted characters.
 * Fetches character data from REST API for soft-deleted IDs.
 * Provides restore actions with toast notifications.
 */
export function useDeletedCharacters(enabled: boolean): UseDeletedCharactersResult {
  const { deletedCharacterIds, restoreCharacter, deletedCount } = useSoftDeleteCharacters();
  const [deletedCharacters, setDeletedCharacters] = useState<DeletedCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || deletedCount === 0) {
      setDeletedCharacters([]);
      return;
    }

    const fetchDeletedCharacters = async () => {
      setIsLoading(true);
      try {
        const ids = Array.from(deletedCharacterIds);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${ids.join(',')}`
        );
        const result: unknown = await response.json();
        const characters = Array.isArray(result) ? result : [result];
        setDeletedCharacters(
          characters.map((char: { id: number; name: string; image: string; species: string }) => ({
            id: String(char.id) as CharacterId,
            name: char.name,
            image: char.image,
            species: char.species,
          }))
        );
      } catch {
        setDeletedCharacters([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDeletedCharacters();
  }, [enabled, deletedCharacterIds, deletedCount]);

  const handleRestoreSingle = useCallback((character: DeletedCharacter) => {
    restoreCharacter(character.id);
    toast.success(`${character.name} restored`, {
      description: 'The character is now visible in the list.',
    });
  }, [restoreCharacter]);

  const handleRestoreAll = useCallback(() => {
    const count = deletedCharacters.length;
    deletedCharacters.forEach(c => restoreCharacter(c.id));
    toast.success(`All ${count} characters restored`, {
      description: 'All characters are now visible in the list.',
    });
  }, [deletedCharacters, restoreCharacter]);

  return { deletedCharacters, isLoading, handleRestoreSingle, handleRestoreAll };
}
