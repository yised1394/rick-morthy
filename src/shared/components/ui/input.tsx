import type { InputHTMLAttributes } from 'react';
import { forwardRef as reactForwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
}

/**
 * Reusable input component with label and error handling.
 * Forwards ref for form library integration.
 */
export const Input = reactForwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { label, error, className = '', id, ...rest } = props;
    const inputId = id ?? `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
