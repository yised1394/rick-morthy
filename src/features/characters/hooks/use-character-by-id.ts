import { useQuery } from '@apollo/client';
import { GET_CHARACTER_BY_ID } from '../services/character.queries';
import { createCharacterId } from '@/core/types/global.types';
import type {
  GetCharacterByIdQuery,
  GetCharacterByIdQueryVariables,
} from '../types/character-query.types';

/**
 * Custom hook to fetch a single character by ID.
 *
 * @param id - Character ID to fetch
 * @returns Query result with character data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useCharacterById('1');
 * ```
 */
export function useCharacterById(id: string) {
  return useQuery<GetCharacterByIdQuery, GetCharacterByIdQueryVariables>(
    GET_CHARACTER_BY_ID,
    {
      variables: { id: createCharacterId(id) },
      skip: !id,
    }
  );
}
