import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { CharacterListItem } from '@/features/characters/components/character-list-item';
import { CharacterDetail } from '@/features/characters/components/character-detail';
import { FavoritesSkeleton } from '@/features/favorites/components/favorites-skeleton';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES, getCharacterDetailRoute } from '@/core/config/routes.config';
import { GET_CHARACTERS_BY_IDS } from '@/features/characters/services/character.queries';
import type { CharacterBasic } from '@/features/characters/types/character.types';
import type { GetCharactersByIdsQuery } from '@/features/characters/types/character-query.types';

/**
 * Favorites page with split view layout.
 * Left: List of favorites, Right: Selected character detail
 */
function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, count } = useFavorites();
  const { deletedCharacterIds } = useSoftDeleteCharacters();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  
  // Filter out deleted characters from favorites
  const favoriteIds = useMemo(() => {
    return [...favorites].filter(id => !deletedCharacterIds.has(id));
  }, [favorites, deletedCharacterIds]);
  
  const visibleCount = favoriteIds.length;

  const { data, loading, error, refetch } = useQuery<GetCharactersByIdsQuery>(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: favoriteIds },
      skip: favoriteIds.length === 0,
    }
  );

  const handleCharacterSelect = useCallback((character: CharacterBasic) => {
    setSelectedCharacterId(character.id);
  }, []);

  const handleMobileCharacterClick = useCallback((character: CharacterBasic) => {
    navigate(getCharacterDetailRoute(character.id));
  }, [navigate]);

  // Show empty state if no visible favorites
  if (visibleCount === 0) {
    return (
      <MainLayout>
        <EmptyState
          title="No favorites yet"
          description="Start exploring characters and add some to your favorites!"
          action={
            <Link to={ROUTES.CHARACTERS}>
              <Button>Browse Characters</Button>
            </Link>
          }
        />
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4">
          <FavoritesSkeleton count={6} />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage
          title="Failed to load favorites"
          message={error.message}
          onRetry={() => refetch()}
        />
      </MainLayout>
    );
  }

  const characters = data?.charactersByIds ?? [];

  return (
    <MainLayout>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-200px)] gap-0">
        {/* Left Panel - Favorites List */}
        <div className="w-96 flex-shrink-0 border-r border-gray-100 flex flex-col">
          {/* Header with back button */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <Link
                to={ROUTES.CHARACTERS}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Back to characters"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Favorites</h1>
            </div>
            <p className="text-sm text-gray-500 pl-8">
              {count} saved {count === 1 ? 'character' : 'characters'}
            </p>
          </div>

          {/* Character list */}
          <div className="flex-1 overflow-y-auto py-2">
            {characters.map((character) => (
              <CharacterListItem
                key={character.id}
                character={character}
                isSelected={selectedCharacterId === character.id}
                onClick={() => handleCharacterSelect(character)}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Character Detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedCharacterId ? (
            <CharacterDetail
              characterId={selectedCharacterId}
              onBack={() => setSelectedCharacterId(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a character to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Favorites</h1>
          <p className="text-sm text-gray-500">
            {count} saved {count === 1 ? 'character' : 'characters'}
          </p>
        </div>

        <div className="space-y-2">
          {characters.map((character) => (
            <CharacterListItem
              key={character.id}
              character={character}
              onClick={() => handleMobileCharacterClick(character)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default FavoritesPage;
