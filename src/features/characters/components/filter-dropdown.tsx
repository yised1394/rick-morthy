import { useState, useEffect,useRef } from 'react';
import type { CharacterFiltersState, CharacterTypeFilter, SpeciesType } from '../types/character-filter.types';

interface FilterDropdownProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onApply: (filters: Partial<CharacterFiltersState>) => void;
}


function getSpeciesFromFilters(species: string): SpeciesType {
  if (species === 'Human') return 'Human';
  if (species === 'Alien') return 'Alien';
  return 'all';
}

/**
 * Filter dropdown/popover with chip-style selectors.
 * Stays open while user selects filters.
 * Only closes when the user clicks the "Filter" button to apply.
 */
export function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterDropdownProps) {
  const [characterType, setCharacterType] = useState<CharacterTypeFilter>('all');
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesType>('all');
  const prevIsOpenRef = useRef(false);

  // Sync local state ONLY when the dropdown transitions from closed → open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setCharacterType(filters.characterType || 'all');
      setSpeciesFilter(getSpeciesFromFilters(filters.species));
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, filters.characterType, filters.species]);

  // Button is disabled when both filters are 'All'
  const isButtonDisabled = characterType === 'all' && speciesFilter === 'all';

  const handleApply = () => {
    if (isButtonDisabled) return;
    onApply({
      species: speciesFilter === 'all' ? '' : speciesFilter,
      characterType: characterType,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 top-full mt-2 z-50 w-full h-[278px] bg-white rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-5 animate-dropdown-in"
      role="dialog"
      aria-label="Filter options"
    >
      {/* Character filter */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Character</h3>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            isActive={characterType === 'all'}
            onClick={() => setCharacterType('all')}
          />
          <FilterChip
            label="Starred"
            isActive={characterType === 'starred'}
            onClick={() => setCharacterType('starred')}
          />
          <FilterChip
            label="Others"
            isActive={characterType === 'others'}
            onClick={() => setCharacterType('others')}
          />
        </div>
      </div>

      {/* Species filter */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Specie</h3>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            isActive={speciesFilter === 'all'}
            onClick={() => setSpeciesFilter('all')}
          />
          <FilterChip
            label="Human"
            isActive={speciesFilter === 'Human'}
            onClick={() => setSpeciesFilter('Human')}
          />
          <FilterChip
            label="Alien"
            isActive={speciesFilter === 'Alien'}
            onClick={() => setSpeciesFilter('Alien')}
          />
        </div>
      </div>

      {/* Apply button — only way to close + apply */}
      <button
        type="button"
        onClick={handleApply}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        className={`
          w-full py-3 rounded-lg text-sm font-medium transition-all duration-150
          ${
            isButtonDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
          }
        `}
      >
        Filter
      </button>
    </div>
  );
}

interface FilterChipProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 rounded-[8px] border border-[1px] text-sm font-medium transition-all duration-150
        ${
          isActive
            ? 'bg-primary-100 border-primary-100 text-primary-600'
            : 'bg-white border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600'
        }
      `}
    >
      {label}
    </button>
  );
}
