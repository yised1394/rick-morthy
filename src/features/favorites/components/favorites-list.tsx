import { useQuery } from '@apollo/client';
import { useFavorites } from '../hooks/use-favorites';
import { CharacterCard } from '@/features/characters/components/character-card';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { FavoritesSkeleton } from './favorites-skeleton';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/routes.config';
import { GET_CHARACTERS_BY_IDS } from '@/features/characters/services/character.queries';
import type { GetCharactersByIdsQuery } from '@/features/characters/types/character-query.types';

/**
 * List of favorite characters.
 */
export function FavoritesList() {
  const { favorites, count } = useFavorites();
  const favoriteIds = [...favorites];

  const { data, loading, error, refetch } = useQuery<GetCharactersByIdsQuery>(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: favoriteIds },
      skip: favoriteIds.length === 0,
    }
  );

  if (count === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Start exploring characters and add some to your favorites!"
        action={
          <Link to={ROUTES.CHARACTERS}>
            <Button>Browse Characters</Button>
          </Link>
        }
      />
    );
  }

  if (loading) {
    return <FavoritesSkeleton count={4} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load favorites"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  const characters = data?.charactersByIds ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-neutral-600">
          {count} favorite{count !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}
