import { useParams, useNavigate } from "react-router-dom";
import { useCharacterById } from "../hooks/use-character-by-id";
import { ErrorMessage } from "@/shared/components/ui/error-message";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { DeleteButton } from "@/features/soft-delete/components/delete-button";
import { CommentSection } from "@/features/comments/components/comment-section";
import { useSoftDeleteCharacters } from "@/features/soft-delete/hooks/use-soft-delete-characters";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { ROUTES } from "@/core/config/routes.config";
import { createCharacterId } from "@/core/types/global.types";
import { ChevronIcon } from "@/shared/components/icons/chevron-icon";
import type { Character } from "../types/character.types";

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
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const id = characterId ?? routeId ?? "";
  const { data, loading, error, refetch } = useCharacterById(id);

  const { isDeleted, restoreCharacter } = useSoftDeleteCharacters();

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
          This character has been removed from your list. You can restore it to
          view details again.
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
      <div className="min-h-screen p-4 space-y-4 animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        {/* Back arrow container: 375px × 70px, 16px padding */}
        <div className="mx-auto max-w-[375px] h-[70px] p-4 flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="p-2.5 -ml-2.5 rounded-lg transition-all duration-150 active:scale-95 hover:bg-primary-100 text-primary-600"
            aria-label="Go back to character list"
          >
            <ChevronIcon direction="left" size={24} />
          </button>
        </div>

        <div className="mx-auto max-w-[375px] px-4 pb-8">

          {/* Avatar with favorite badge */}
          <div className="flex items-start justify-start mt-10 mb-4">
            <div className="relative w-[100px] h-[100px]">
              <img
                src={character.image}
                alt={character.name}
                className="h-full w-full rounded-full object-cover"
              />

              <div className="absolute -bottom-1 -right-1">
                <FavoriteButton
                  characterId={character.id}
                  size="sm"
                  variant="minimal"
                />
              </div>
            </div>
          </div>

          {/* Name and Delete Button */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              {character.name}
            </h1>
            <DeleteButton
              characterId={character.id}
              characterName={character.name}
              size="md"
            />
          </div>

          {/* Info sections with dividers */}
          <div>
            <MobileInfoSection
              label="Specie"
              value={character.species}
              className="pb-5"
            />
            <div className="h-px w-full bg-gray-200" />
            <MobileInfoSection
              label="Status"
              value={character.status}
              className="py-5"
            />
            <div className="h-px w-full bg-gray-200" />
            <MobileInfoSection
              label="Occupation"
              value={character.type || "Unknown"}
              className="pt-5 pb-10"
            />
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
          <h1 className="text-2xl font-bold text-gray-800">{character.name}</h1>
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
          <CharacterInfoRow
            label="Occupation"
            value={character.type || "Unknown"}
          />
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

function MobileInfoSection({
  label,
  value,
  className = "",
}: MobileInfoSectionProps) {
  return (
    <div className={className}>
      <dt className="text-base font-bold text-gray-800 tracking-tight mb-1.5">
        {label}
      </dt>
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
export function CharacterDetailCompact({
  character,
}: {
  readonly character: Character;
}) {
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
      <h2 className="text-xl font-bold text-gray-800 mb-6">{character.name}</h2>

      {/* Info sections */}
      <div className="space-y-4">
        <CharacterInfoRow label="Specie" value={character.species} />
        <CharacterInfoRow label="Status" value={character.status} />
        <CharacterInfoRow
          label="Occupation"
          value={character.type || "Unknown"}
        />
      </div>
    </div>
  );
}
