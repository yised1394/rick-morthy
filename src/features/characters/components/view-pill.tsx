interface ViewPillProps {
  readonly label: string;
  readonly count?: number;
  readonly active: boolean;
  readonly onClick: () => void;
}

/**
 * View pill toggle for switching between All, Starred, and Deleted views.
 */
export function ViewPill({ label, count, active, onClick }: ViewPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3.5 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 border
        ${active
          ? 'bg-purple-50 text-purple-600 border-purple-200'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`
            ml-1.5 px-1.5 py-0.5 rounded-md text-xs font-semibold
            ${active ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
}
