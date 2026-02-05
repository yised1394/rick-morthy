import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterById } from '../hooks/use-character-by-id';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { CommentSection } from '@/features/comments/components/comment-section';
import { ROUTES } from '@/core/config/routes.config';
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
  const id = characterId ?? routeId ?? '';
  const { data, loading, error, refetch } = useCharacterById(id);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

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

  return (
    <div className="h-full">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="text-primary-600 hover:text-primary-700 transition-colors mb-6"
        aria-label="Go back"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Character info */}
      <div className="space-y-6">
        {/* Avatar with favorite indicator */}
        <div className="relative inline-block">
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
        <h1 className="text-2xl font-bold text-gray-800">
          {character.name}
        </h1>

        {/* Info sections */}
        <div className="space-y-4">
          <CharacterInfoRow label="Specie" value={character.species} />
          <CharacterInfoRow label="Status" value={character.status} />
          <CharacterInfoRow label="Occupation" value={character.type || 'Unknown'} />
        </div>
      </div>

      {/* Comments section - only show on standalone page */}
      {!characterId && (
        <div className="mt-8">
          <CommentSection characterId={character.id} />
        </div>
      )}
    </div>
  );
}

interface CharacterInfoRowProps {
  readonly label: string;
  readonly value: string;
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
