import { SORT_OPTIONS, type SortOption } from '@/shared/constants/app.constants';

interface CharacterSortProps {
  readonly value: SortOption | '';
  readonly onChange: (value: SortOption | '') => void;
}

/**
 * Sort selector for character list.
 */
export function CharacterSort({ value, onChange }: CharacterSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-foreground whitespace-nowrap"
      >
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption | '')}
        className="input w-auto"
      >
        <option value="">Default</option>
        <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
        <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
      </select>
    </div>
  );
}
