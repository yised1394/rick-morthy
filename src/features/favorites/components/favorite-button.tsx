import type { MouseEvent } from 'react';
import { useFavorites } from '../hooks/use-favorites';
import type { CharacterId } from '@/core/types/global.types';

interface FavoriteButtonProps {
  readonly characterId: CharacterId;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly onClick?: (event: MouseEvent) => void;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

/**
 * Toggle button for adding/removing characters from favorites.
 */
export function FavoriteButton({
  characterId,
  size = 'md',
  onClick,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(characterId);

  const handleClick = (event: MouseEvent) => {
    onClick?.(event);
    toggleFavorite(characterId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFav}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center rounded-full
        bg-white/90 backdrop-blur-sm
        shadow-md transition-all
        hover:scale-110 hover:bg-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      `}
    >
      <svg
        className={`${iconSizes[size]} transition-colors ${
          isFav ? 'fill-danger text-danger' : 'fill-none text-neutral-500'
        }`}
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
    </button>
  );
}
