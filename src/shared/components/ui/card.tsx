import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

/**
 * Card container component with consistent styling.
 */
export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Card header section component.
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Card title component with semantic heading.
 */
export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag className={`card-title ${className}`}>
      {children}
    </Tag>
  );
}

interface CardBodyProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Card body content section.
 */
export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
}
