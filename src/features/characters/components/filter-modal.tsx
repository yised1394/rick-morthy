import { useState, useEffect } from 'react';
import { ChevronIcon } from '@/shared/components/icons/chevron-icon';
import type { CharacterFiltersState, CharacterType, SpeciesType } from '../types/character-filter.types';

interface FilterModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly filters: CharacterFiltersState;
  readonly onApply: (filters: Partial<CharacterFiltersState>) => void;
}

/**
 * Filter modal/page with chip-style selectors (Figma design).
 * Supports character type, species filtering.
 */
export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterModalProps) {
  const [characterType, setCharacterType] = useState<CharacterType>('all');
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesType>('all');

  // Sync with external filters
  useEffect(() => {
    if (filters.species === 'Human') {
      setSpeciesFilter('Human');
    } else if (filters.species === 'Alien') {
      setSpeciesFilter('Alien');
    } else {
      setSpeciesFilter('all');
    }
  }, [filters.species]);

  const handleApply = () => {
    const newFilters: Partial<CharacterFiltersState> = {
      species: speciesFilter === 'all' ? '' : speciesFilter,
    };
    onApply(newFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl shadow-xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="text-primary-600 hover:text-primary-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronIcon direction="left" size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <div className="w-5" /> {/* Spacer for centering */}
        </div>

        {/* Filter sections */}
        <div className="px-6 py-6 space-y-6">
          {/* Characters filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Characters</h3>
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
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Specie</h3>
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
        </div>

        {/* Footer with apply button */}
        <div className="px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Filter
          </button>
        </div>
      </div>
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
        px-4 py-2 rounded-lg border text-sm font-medium transition-all
        ${isActive
          ? 'bg-primary-100 border-primary-100 text-primary-600'
          : 'bg-white border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600'
        }
      `}
    >
      {label}
    </button>
  );
}