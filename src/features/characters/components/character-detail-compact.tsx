import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { CharacterInfoRow } from "./character-info-row";
import type { Character } from "../types/character.types";

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
