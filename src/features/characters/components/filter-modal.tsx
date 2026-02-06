import { useState, useEffect } from 'react';
import { ChevronIcon } from '@/shared/components/icons/chevron-icon';
import type { CharacterFiltersState, CharacterTypeFilter, SpeciesType } from '../types/character-filter.types';
import type { CharacterStatus, CharacterGender } from '../types/character.types';

interface FilterModalProps {
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
 * Filter modal/page with chip-style selectors.
 * Supports character type, species, status, and gender filtering.
 */
export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterModalProps) {
  const [characterType, setCharacterType] = useState<CharacterTypeFilter>('all');
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesType>('all');
  const [statusFilter, setStatusFilter] = useState<CharacterStatus | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<CharacterGender | 'all'>('all');

  // Sync with external filters
  useEffect(() => {
    if (isOpen) {
      setCharacterType(filters.characterType || 'all');
      setSpeciesFilter(getSpeciesFromFilters(filters.species));
      setStatusFilter((filters.status as CharacterStatus) || 'all');
      setGenderFilter((filters.gender as CharacterGender) || 'all');
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onApply({
      species: speciesFilter === 'all' ? '' : speciesFilter,
      status: statusFilter === 'all' ? '' : statusFilter,
      gender: genderFilter === 'all' ? '' : genderFilter,
      characterType: characterType,
    });
    onClose();
  };

  const handleClear = () => {
    setCharacterType('all');
    setSpeciesFilter('all');
    setStatusFilter('all');
    setGenderFilter('all');
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
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl shadow-xl animate-slide-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-primary-600 hover:text-primary-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronIcon direction="left" size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button 
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:text-primary-600"
          >
            Clear
          </button>
        </div>

        {/* Filter sections - Scrollable */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
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

          {/* Status filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All"
                isActive={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
              />
              <FilterChip
                label="Alive"
                isActive={statusFilter === 'Alive'}
                onClick={() => setStatusFilter('Alive')}
              />
              <FilterChip
                label="Dead"
                isActive={statusFilter === 'Dead'}
                onClick={() => setStatusFilter('Dead')}
              />
              <FilterChip
                label="Unknown"
                isActive={statusFilter === 'unknown'}
                onClick={() => setStatusFilter('unknown')}
              />
            </div>
          </div>

          {/* Species filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Species</h3>
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

          {/* Gender filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All"
                isActive={genderFilter === 'all'}
                onClick={() => setGenderFilter('all')}
              />
              <FilterChip
                label="Female"
                isActive={genderFilter === 'Female'}
                onClick={() => setGenderFilter('Female')}
              />
              <FilterChip
                label="Male"
                isActive={genderFilter === 'Male'}
                onClick={() => setGenderFilter('Male')}
              />
              <FilterChip
                label="Genderless"
                isActive={genderFilter === 'Genderless'}
                onClick={() => setGenderFilter('Genderless')}
              />
              <FilterChip
                label="Unknown"
                isActive={genderFilter === 'unknown'}
                onClick={() => setGenderFilter('unknown')}
              />
            </div>
          </div>
        </div>

        {/* Footer with apply button */}
        <div className="px-6 pb-6 pt-2 flex-shrink-0 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors mt-4"
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