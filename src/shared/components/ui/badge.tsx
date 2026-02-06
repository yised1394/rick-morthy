import type { ReactNode } from 'react';

export interface BadgeProps {
  readonly children: ReactNode;
  readonly variant?: 'default' | 'alive' | 'dead' | 'unknown';
  readonly className?: string;
}

const variantClasses = {
  default: 'bg-neutral-100 text-neutral-700',
  alive: 'badge-alive',
  dead: 'badge-dead',
  unknown: 'badge-unknown',
} as const;

/**
 * Badge component for displaying status or labels.
 */
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Get badge variant based on character status.
 */
export function getStatusVariant(status: string): BadgeProps['variant'] {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'alive') return 'alive';
  if (normalizedStatus === 'dead') return 'dead';
  return 'unknown';
}
