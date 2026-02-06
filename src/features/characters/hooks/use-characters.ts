import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../services/character.queries';
import type {
  GetCharactersQuery,
  GetCharactersQueryVariables,
  CharacterFilter,
} from '../types/character-query.types';

export interface UseCharactersOptions {
  readonly page: number;
  readonly filter?: CharacterFilter;
}

/**
 * Custom hook to fetch paginated characters with optional filtering.
 *
 * @param options - Query options including page number and filters
 * @returns Query result with characters data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useCharacters({
 *   page: 1,
 *   filter: { status: 'Alive' }
 * });
 * ```
 */
export function useCharacters(options: UseCharactersOptions) {
  const { page, filter } = options;

  return useQuery<GetCharactersQuery, GetCharactersQueryVariables>(
    GET_CHARACTERS,
    {
      variables: {
        page,
        filter: filter ?? {},
      },
      notifyOnNetworkStatusChange: true,
    }
  );
}
