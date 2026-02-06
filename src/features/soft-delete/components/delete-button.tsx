import { useState } from 'react';
import { useSoftDeleteCharacters } from '../hooks/use-soft-delete-characters';
import { ConfirmationModal } from '@/shared/components/ui/confirmation-modal';
import { TrashIcon } from '@/shared/components/icons/trash-icon';
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
        <TrashIcon size={size === 'sm' ? 16 : 20} />
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
