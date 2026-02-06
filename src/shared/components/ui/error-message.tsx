import { Button } from './button';

export interface ErrorMessageProps {
  readonly title: string;
  readonly message: string;
  readonly onRetry?: () => void;
}

/**
 * Generic error message component with optional retry action.
 */
export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-4 text-danger">
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      <p className="mt-2 text-sm text-neutral-600">{message}</p>

      {onRetry && (
        <Button onClick={onRetry} className="mt-6">
          Try again
        </Button>
      )}
    </div>
  );
}
