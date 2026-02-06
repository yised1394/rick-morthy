import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CharacterFiltersState, CharacterTypeFilter, SpeciesType } from '../types/character-filter.types';

interface FilterMobileSheetProps {
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
 * Full-screen bottom sheet filter for mobile viewports.
 * Slides up from bottom, covers ~95% of viewport.
 * Back arrow discards changes; "Filter" button applies them.
 */
export function FilterMobileSheet({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterMobileSheetProps) {
  const [characterType, setCharacterType] = useState<CharacterTypeFilter>('all');
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesType>('all');

  // Sync local state when the sheet opens
  useEffect(() => {
    if (isOpen) {
      setCharacterType(filters.characterType || 'all');
      setSpeciesFilter(getSpeciesFromFilters(filters.species));
    }
  }, [isOpen, filters.characterType, filters.species]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isButtonDisabled = characterType === 'all' && speciesFilter === 'all';

  const handleApply = () => {
    if (isButtonDisabled) return;
    onApply({
      species: speciesFilter === 'all' ? '' : speciesFilter,
      characterType,
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-overlay-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 animate-sheet-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Filter options"
      >
        <div className="bg-[#F5F5F7] rounded-t-3xl h-[95vh] flex flex-col">
          {/* Header */}
          <div className="relative flex items-center h-14 px-4 border-b border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-3 -ml-3 active:scale-95 transition-transform"
              aria-label="Go back"
            >
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-800">
              Filters
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
            <div className="space-y-8">
              {/* Characters section */}
              <div>
                <h3 className="text-base font-medium text-gray-500 mb-3">Characters</h3>
                <div className="flex gap-3 flex-wrap">
                  <MobileFilterChip
                    label="All"
                    isActive={characterType === 'all'}
                    onClick={() => setCharacterType('all')}
                  />
                  <MobileFilterChip
                    label="Starred"
                    isActive={characterType === 'starred'}
                    onClick={() => setCharacterType('starred')}
                  />
                  <MobileFilterChip
                    label="Others"
                    isActive={characterType === 'others'}
                    onClick={() => setCharacterType('others')}
                  />
                </div>
              </div>

              {/* Species section */}
              <div>
                <h3 className="text-base font-medium text-gray-500 mb-3">Specie</h3>
                <div className="flex gap-3 flex-wrap">
                  <MobileFilterChip
                    label="All"
                    isActive={speciesFilter === 'all'}
                    onClick={() => setSpeciesFilter('all')}
                  />
                  <MobileFilterChip
                    label="Human"
                    isActive={speciesFilter === 'Human'}
                    onClick={() => setSpeciesFilter('Human')}
                  />
                  <MobileFilterChip
                    label="Alien"
                    isActive={speciesFilter === 'Alien'}
                    onClick={() => setSpeciesFilter('Alien')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed bottom button */}
          <div className="absolute bottom-5 left-5 right-5">
            <button
              type="button"
              onClick={handleApply}
              disabled={isButtonDisabled}
              aria-disabled={isButtonDisabled}
              className={`
                w-full h-[52px] rounded-xl text-base font-semibold transition-all duration-200
                ${
                  isButtonDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-[0.98]'
                }
              `}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface MobileFilterChipProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

function MobileFilterChip({ label, isActive, onClick }: MobileFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-5 h-10 rounded-[8px] border text-[15px] transition-all duration-200
        active:scale-95
        ${
          isActive
            ? 'bg-primary-100 text-primary-600 border-primary-100 font-medium'
            : 'bg-white text-gray-700 border-gray-300 font-normal'
        }
      `}
    >
      {label}
    </button>
  );
}
