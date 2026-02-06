import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { CharacterDetail } from '@/features/characters/components/character-detail';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { DeletedSkeleton } from '@/features/characters/components/deleted-skeleton';
import { ROUTES } from '@/core/config/routes.config';
import type { CharacterId } from '@/core/types/global.types';
import type { DeletedCharacter } from '@/features/characters/types/character.types';

/**
 * Page for viewing and restoring deleted characters.
 * Uses split layout matching Characters and Favorites pages.
 */
function DeletedCharactersPage() {
  const { deletedCharacterIds, restoreCharacter, deletedCount } = useSoftDeleteCharacters();
  const [deletedCharacters, setDeletedCharacters] = useState<DeletedCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId | null>(null);

  // Fetch character data for deleted IDs
  useEffect(() => {
    const fetchDeletedCharacters = async () => {
      if (deletedCharacterIds.size === 0) {
        setDeletedCharacters([]);
        setSelectedCharacterId(null);
        setIsLoading(false);
        return;
      }

      try {
        const ids = Array.from(deletedCharacterIds);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${ids.join(',')}`
        );
        const data = await response.json();

        // API returns object for single, array for multiple
        const characters = Array.isArray(data) ? data : [data];
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
  }, [deletedCharacterIds]);

  // Clear selection when character is restored
  useEffect(() => {
    if (selectedCharacterId && !deletedCharacterIds.has(selectedCharacterId)) {
      setSelectedCharacterId(null);
    }
  }, [deletedCharacterIds, selectedCharacterId]);

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

  const handleCharacterSelect = useCallback((character: DeletedCharacter) => {
    setSelectedCharacterId(character.id);
  }, []);

  // Empty state
  if (!isLoading && deletedCount === 0) {
    return (
      <MainLayout>
        <EmptyState
          title="No deleted characters"
          description="Characters you delete will appear here. You can restore them at any time."
          action={
            <Link
              to={ROUTES.CHARACTERS}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Characters
            </Link>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Desktop Layout - Split View */}
      <div className="hidden lg:flex h-[calc(100vh-200px)] gap-0">
        {/* Left Panel - Deleted Characters List */}
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
              <h1 className="text-xl font-bold text-gray-800">Deleted</h1>
            </div>
            <div className="flex items-center justify-between pl-8">
              <p className="text-sm text-gray-500">
                {deletedCount} {deletedCount === 1 ? 'character' : 'characters'}
              </p>
              {deletedCharacters.length > 1 && (
                <button
                  type="button"
                  onClick={handleRestoreAll}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Restore All
                </button>
              )}
            </div>
          </div>

          {/* Character list */}
          <div className="flex-1 overflow-y-auto py-2">
            {isLoading ? (
              <div className="p-4">
                <DeletedSkeleton count={4} />
              </div>
            ) : (
              deletedCharacters.map((character) => (
                <div
                  key={character.id}
                  className={`
                    flex items-center gap-3 px-4 py-3 cursor-pointer transition-all
                    border-l-4 rounded-r-lg
                    ${selectedCharacterId === character.id
                      ? 'bg-red-50 border-l-red-500'
                      : 'border-transparent hover:bg-gray-50'
                    }
                  `}
                  onClick={() => handleCharacterSelect(character)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCharacterSelect(character);
                    }
                  }}
                >
                  {/* Avatar with opacity */}
                  <div className="flex-shrink-0">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-10 h-10 rounded-full object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-600 truncate">
                      {character.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {character.species}
                    </p>
                  </div>

                  {/* Restore button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreSingle(character);
                    }}
                    className="flex-shrink-0 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    aria-label={`Restore ${character.name}`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
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
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg
                className="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <p>Select a character to preview</p>
              <p className="text-sm">Click restore to bring them back</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-6">
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
            <h1 className="text-xl font-bold text-gray-800">Deleted</h1>
          </div>
          <div className="flex items-center justify-between pl-8">
            <p className="text-sm text-gray-500">
              {deletedCount} {deletedCount === 1 ? 'character' : 'characters'}
            </p>
            {deletedCharacters.length > 1 && (
              <button
                type="button"
                onClick={handleRestoreAll}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Restore All
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-4">
            <DeletedSkeleton count={4} />
          </div>
        ) : (
          <div className="space-y-2">
            {deletedCharacters.map((character) => (
              <div
                key={character.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-10 h-10 rounded-full object-cover opacity-60"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-600 truncate">
                    {character.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {character.species}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRestoreSingle(character)}
                  className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default DeletedCharactersPage;
