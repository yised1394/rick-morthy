import { useNavigate } from 'react-router-dom';
import { getCharacterDetailRoute } from '@/core/config/routes.config';
import { Badge, getStatusVariant } from '@/shared/components/ui/badge';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { AsyncImage } from '@/shared/components/ui/async-image';
import type { CharacterBasic } from '../types/character.types';

interface CharacterCardProps {
  readonly character: CharacterBasic;
}

/**
 * Card component displaying character information.
 * Clickable to navigate to character detail page.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getCharacterDetailRoute(character.id));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="
        group relative overflow-hidden rounded-lg
        bg-card shadow-md transition-all
        hover:shadow-lg hover:-translate-y-1
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
        cursor-pointer
      "
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${character.name}`}
    >
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton
          characterId={character.id}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="aspect-square overflow-hidden">
        <AsyncImage
          src={character.image}
          alt={character.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant={getStatusVariant(character.status)}>
            {character.status}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
          {character.name}
        </h3>

        <p className="mt-1 text-sm text-neutral-600">
          {character.species}
        </p>
      </div>
    </article>
  );
}
