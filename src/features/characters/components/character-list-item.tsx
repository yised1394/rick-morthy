import type { CharacterBasic } from '../types/character.types';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { AsyncImage } from '@/shared/components/ui/async-image';

interface CharacterListItemProps {
  readonly character: CharacterBasic;
  readonly isSelected?: boolean;
  readonly onClick?: () => void;
}

/**
 * List item component for character display (Figma design).
 * Shows avatar, name, species, and favorite button.
 */
export function CharacterListItem({
  character,
  isSelected = false,
  onClick,
}: CharacterListItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer transition-all
        border-l-4 rounded-r-lg
        ${isSelected
          ? 'bg-primary-100 border-l-primary-600'
          : 'border-transparent hover:bg-gray-50'
        }
      `}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${character.name}`}
      aria-selected={isSelected}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <AsyncImage
          src={character.image}
          alt={character.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* Character Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {character.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {character.species}
        </p>
      </div>

      {/* Favorite Button */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton
          characterId={character.id}
          size="sm"
          variant="minimal"
        />
      </div>
    </div>
  );
}

