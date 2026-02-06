import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterById } from '../hooks/use-character-by-id';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { DeleteButton } from '@/features/soft-delete/components/delete-button';
import { CommentSection } from '@/features/comments/components/comment-section';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { ROUTES } from '@/core/config/routes.config';
import { createCharacterId } from '@/core/types/global.types';
import type { Character } from '../types/character.types';

interface CharacterDetailProps {
  readonly characterId?: string;
  readonly onBack?: () => void;
}

/**
 * Character detail view with full information (Figma design).
 * Can be used standalone or embedded in a split layout.
 */
export function CharacterDetail({ characterId, onBack }: CharacterDetailProps) {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const id = characterId ?? routeId ?? '';
  const { data, loading, error, refetch } = useCharacterById(id);

  const { isDeleted, restoreCharacter } = useSoftDeleteCharacters();
  const { isFavorite } = useFavorites();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Check if character is soft deleted
  if (id && isDeleted(createCharacterId(id))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-amber-50 rounded-full p-4 mb-4">
          <svg
            className="h-12 w-12 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Character Deleted
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          This character has been removed from your list. You can restore it to view details again.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => restoreCharacter(createCharacterId(id))}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Restore Character
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load character"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.character) {
    return (
      <ErrorMessage
        title="Character not found"
        message="The character you're looking for doesn't exist."
        onRetry={() => navigate(ROUTES.CHARACTERS)}
      />
    );
  }

  const character = data.character;
  const isFav = isFavorite(character.id);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[375px] px-4 pt-4 pb-8">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            className="p-2.5 -ml-2.5 rounded-lg transition-all duration-150 active:scale-95 hover:bg-primary-100"
            aria-label="Go back to character list"
          >
            <svg
              className="h-6 w-6 text-primary-600"
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
          </button>

          {/* Avatar with favorite badge */}
          <div className="mt-10 mb-4">
            <div className="relative mx-auto w-[100px] h-[100px]">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full rounded-full object-cover"
              />
              {isFav && (
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-secondary-600">
                  <svg
                    className="h-3.5 w-3.5 fill-white text-white"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-xl font-bold text-gray-800 tracking-tight mb-6">
            {character.name}
          </h1>

          {/* Info sections with dividers */}
          <div>
            <MobileInfoSection label="Specie" value={character.species} className="pb-5" />
            <div className="h-px w-full bg-gray-200" />
            <MobileInfoSection label="Status" value={character.status} className="py-5" />
            <div className="h-px w-full bg-gray-200" />
            <MobileInfoSection label="Occupation" value={character.type || 'Unknown'} className="pt-5 pb-10" />
          </div>

          {/* Comments section */}
          <div className="mt-8">
            <CommentSection characterId={character.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-[100px]">
      {/* Character info */}
      <div className="space-y-6 pt-10">
        {/* Avatar with action buttons */}
        <div className="relative inline-block">
          <img
            src={character.image}
            alt={character.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 flex gap-1">
            <FavoriteButton
              characterId={character.id}
              size="sm"
              variant="minimal"
            />
          </div>
        </div>

        {/* Name and Delete button */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {character.name}
          </h1>
          <DeleteButton
            characterId={character.id}
            characterName={character.name}
            size="md"
          />
        </div>

        {/* Info sections */}
        <div className="space-y-4">
          <CharacterInfoRow label="Specie" value={character.species} />
          <CharacterInfoRow label="Status" value={character.status} />
          <CharacterInfoRow label="Occupation" value={character.type || 'Unknown'} />
        </div>
      </div>

      {/* Comments section - always show */}
      <div className="mt-8">
        <CommentSection characterId={character.id} />
      </div>
    </div>
  );
}

interface CharacterInfoRowProps {
  readonly label: string;
  readonly value: string;
}

interface MobileInfoSectionProps {
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function MobileInfoSection({ label, value, className = '' }: MobileInfoSectionProps) {
  return (
    <div className={className}>
      <dt className="text-base font-bold text-gray-800 tracking-tight mb-1.5">{label}</dt>
      <dd className="text-[15px] text-gray-500">{value}</dd>
    </div>
  );
}

function CharacterInfoRow({ label, value }: CharacterInfoRowProps) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <dt className="text-sm font-semibold text-gray-800 mb-1">{label}</dt>
      <dd className="text-sm text-gray-500">{value}</dd>
    </div>
  );
}

/**
 * Compact version of character detail for use in split layouts.
 */
export function CharacterDetailCompact({ character }: { readonly character: Character }) {
  return (
    <div className="p-6">
      {/* Avatar with favorite indicator */}
      <div className="relative inline-block mb-4">
        <img
          src={character.image}
          alt={character.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1">
          <FavoriteButton
            characterId={character.id}
            size="sm"
            variant="minimal"
          />
        </div>
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {character.name}
      </h2>

      {/* Info sections */}
      <div className="space-y-4">
        <CharacterInfoRow label="Specie" value={character.species} />
        <CharacterInfoRow label="Status" value={character.status} />
        <CharacterInfoRow label="Occupation" value={character.type || 'Unknown'} />
      </div>
    </div>
  );
}
