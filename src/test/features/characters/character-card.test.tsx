import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FavoritesProvider } from '@/features/favorites/context/favorites-context';
import { CharacterCard } from '@/features/characters/components/character-card';
import type { CharacterBasic } from '@/features/characters/types/character.types';

import { createCharacterId } from '@/core/types/global.types';

const mockCharacter: CharacterBasic = {
  id: createCharacterId('1'),
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  species: 'Human',
  status: 'Alive',
  gender: 'Male',
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <FavoritesProvider>
        {ui}
      </FavoritesProvider>
    </BrowserRouter>
  );
}

describe('CharacterCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders character name', () => {
    renderWithProviders(<CharacterCard character={mockCharacter} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders character species', () => {
    renderWithProviders(<CharacterCard character={mockCharacter} />);
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('displays character image', () => {
    renderWithProviders(<CharacterCard character={mockCharacter} />);
    const image = screen.getByAltText('Rick Sanchez');
    expect(image).toHaveAttribute('src', mockCharacter.image);
  });

  it('shows status badge', () => {
    renderWithProviders(<CharacterCard character={mockCharacter} />);
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });
});
