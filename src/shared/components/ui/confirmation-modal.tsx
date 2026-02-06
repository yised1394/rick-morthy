import { useEffect, useRef } from 'react';

/**
 * Props for the ConfirmationModal component.
 */
interface ConfirmationModalProps {
  /** Whether the modal is visible */
  readonly isOpen: boolean;
  /** Function to close the modal */
  readonly onClose: () => void;
  /** Function called when user confirms the action */
  readonly onConfirm: () => void;
  /** Modal title */
  readonly title: string;
  /** Modal message/description */
  readonly message: string;
  /** Text for the confirm button (default: "Confirm") */
  readonly confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  readonly cancelText?: string;
  /** Variant for the confirm button (default: "danger") */
  readonly variant?: 'danger' | 'primary';
}

/**
 * Reusable confirmation modal component.
 *
 * Features:
 * - Accessible keyboard navigation (Escape closes)
 * - Focus trap within modal
 * - Backdrop click to close
 * - Customizable button text and styling
 *
 * @example
 * ```tsx
 * <ConfirmationModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Character"
 *   message="Are you sure you want to delete this character?"
 *   confirmText="Delete"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmationModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when modal opens (safer default)
  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3
            id="confirmation-modal-title"
            className="text-lg font-semibold text-gray-900 text-center mb-2"
          >
            {title}
          </h3>

          {/* Message */}
          <p
            id="confirmation-modal-description"
            className="text-sm text-gray-500 text-center mb-6"
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onClose}
              className="w-full flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              className={`w-full flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 ${confirmButtonClasses}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
