import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
} as const;

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
} as const;

/**
 * Reusable button component with consistent styling.
 * Uses Tailwind v4 design tokens for theming.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...rest
  } = props;

  const classes = [
    'btn',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
