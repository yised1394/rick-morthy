import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FavoritesProvider } from '@/features/favorites/context/favorites-context';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { createCharacterId } from '@/core/types/global.types';

const characterId = createCharacterId('1');

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </BrowserRouter>
  );
}

describe('FavoriteButton Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles favorite state when clicked', () => {
    renderWithProviders(<FavoriteButton characterId={characterId} />);

    const button = screen.getByRole('button');

    // Initially not favorite
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');

    // Click to add favorite
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites');

    // Click to remove favorite
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('persists favorite state across remounts', () => {
    const { unmount } = renderWithProviders(<FavoriteButton characterId={characterId} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    unmount();

    // Remount component
    renderWithProviders(<FavoriteButton characterId={characterId} />);

    const newButton = screen.getByRole('button');
    expect(newButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('shows correct icon based on favorite status', () => {
    renderWithProviders(<FavoriteButton characterId={characterId} />);

    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');

    expect(icon).toBeInTheDocument();

    fireEvent.click(button);

    // Icon should still be present (just filled vs outlined)
    const iconAfter = button.querySelector('svg');
    expect(iconAfter).toBeInTheDocument();
  });

  it('works with multiple instances for same character', () => {
    renderWithProviders(
      <>
        <FavoriteButton characterId={characterId} />
        <FavoriteButton characterId={characterId} />
      </>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // Click first button
    fireEvent.click(buttons[0]!);

    // Both buttons should reflect the change
    expect(buttons[0]!).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(buttons[1]!).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('maintains separate state for different characters', () => {
    const characterId2 = createCharacterId('2');

    renderWithProviders(
      <>
        <FavoriteButton characterId={characterId} />
        <FavoriteButton characterId={characterId2} />
      </>
    );

    const buttons = screen.getAllByRole('button');

    // Favorite only the first character
    fireEvent.click(buttons[0]!);

    expect(buttons[0]!).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(buttons[1]!).toHaveAttribute('aria-label', 'Add to favorites');
  });
});
