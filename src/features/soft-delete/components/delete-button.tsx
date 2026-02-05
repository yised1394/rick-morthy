import { useState } from 'react';
import { useSoftDeleteCharacters } from '../hooks/use-soft-delete-characters';
import { ConfirmationModal } from '@/shared/components/ui/confirmation-modal';
import type { CharacterId } from '@/core/types/global.types';

/**
 * Props for the DeleteButton component.
 */
interface DeleteButtonProps {
  /** The character ID to delete */
  readonly characterId: CharacterId;
  /** Optional size variant */
  readonly size?: 'sm' | 'md';
  /** Optional custom class name */
  readonly className?: string;
  /** Optional callback after deletion */
  readonly onDeleted?: () => void;
  /** Optional character name for confirmation message */
  readonly characterName?: string;
}

/**
 * Delete button component with confirmation modal.
 *
 * Shows a confirmation modal before soft-deleting the character.
 * Deleted characters can be restored from the deleted characters page.
 *
 * @example
 * ```tsx
 * <DeleteButton
 *   characterId={character.id}
 *   characterName={character.name}
 *   onDeleted={() => console.log('Deleted!')}
 * />
 * ```
 */
export function DeleteButton({
  characterId,
  size = 'md',
  className = '',
  onDeleted,
  characterName,
}: DeleteButtonProps) {
  const { markAsDeleted, isDeleted } = useSoftDeleteCharacters();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Don't render if already deleted
  if (isDeleted(characterId)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    markAsDeleted(characterId);
    onDeleted?.();
  };

  const confirmMessage = characterName
    ? `Are you sure you want to delete "${characterName}"? You can restore it later from the deleted characters page.`
    : 'Are you sure you want to delete this character? You can restore it later from the deleted characters page.';

  const sizeClasses = size === 'sm'
    ? 'p-1.5 h-7 w-7'
    : 'p-2 h-9 w-9';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center rounded-full
          text-gray-400 hover:text-red-500 hover:bg-red-50
          transition-colors focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-red-500
          ${sizeClasses}
          ${className}
        `}
        aria-label={`Delete character ${characterName ?? ''}`}
      >
        <svg
          className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Character"
        message={confirmMessage}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
