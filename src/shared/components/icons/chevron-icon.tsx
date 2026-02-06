interface IconProps {
  readonly className?: string;
  readonly size?: number;
  readonly direction?: 'up' | 'down' | 'left' | 'right';
}

const pathsByDirection = {
  up: 'M19 15l-7-7-7 7',
  down: 'M5 9l7 7 7-7',
  left: 'M15 19l-7-7 7-7',
  right: 'M9 5l7 7-7 7',
} as const;

export function ChevronIcon({ size = 24, className = '', direction = 'right' }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={pathsByDirection[direction]} />
    </svg>
  );
}
