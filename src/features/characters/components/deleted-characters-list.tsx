import { EmptyState } from '@/shared/components/ui/empty-state';
import { RestoreIcon } from '@/shared/components/icons/restore-icon';
import { DeletedSkeleton } from './deleted-skeleton';
import type { DeletedCharacter } from '../types/character.types';

interface DeletedCharactersListProps {
  readonly characters: readonly DeletedCharacter[];
  readonly isLoading: boolean;
  readonly selectedCharacterId: string | null;
  readonly onSelect: (character: DeletedCharacter) => void;
  readonly onRestore: (character: DeletedCharacter) => void;
  readonly onRestoreAll: () => void;
  readonly deletedCount: number;
}

/**
 * List of deleted characters with restore actions.
 * Used in both desktop and mobile layouts.
 */
export function DeletedCharactersList({
  characters,
  isLoading,
  selectedCharacterId,
  onSelect,
  onRestore,
  onRestoreAll,
  deletedCount,
}: DeletedCharactersListProps) {
  if (isLoading) {
    return <DeletedSkeleton count={4} />;
  }

  if (characters.length === 0) {
    return (
      <EmptyState
        title="No deleted characters"
        description="Characters you delete will appear here."
      />
    );
  }

  return (
    <div>
      {/* Header info */}
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {deletedCount} {deletedCount === 1 ? 'character' : 'characters'}
        </p>
        {characters.length > 1 && (
          <button
            type="button"
            onClick={onRestoreAll}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Restore All
          </button>
        )}
      </div>

      {/* Character rows */}
      <div className="py-2">
        {characters.map((character) => (
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
            onClick={() => onSelect(character)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(character);
            }}
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
              onClick={(e) => {
                e.stopPropagation();
                onRestore(character);
              }}
              className="flex-shrink-0 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              aria-label={`Restore ${character.name}`}
            >
              <RestoreIcon size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
