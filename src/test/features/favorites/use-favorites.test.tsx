import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FavoritesProvider, useFavoritesContext } from '@/features/favorites/context/favorites-context';
import { createCharacterId } from '@/core/types/global.types';

function createWrapper() {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return <FavoritesProvider>{children}</FavoritesProvider>;
  };
}

describe('useFavoritesContext', () => {
  const testId = createCharacterId('1');
  const testId2 = createCharacterId('2');

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current.count).toBe(0);
    expect(result.current.favorites.size).toBe(0);
  });

  it('toggles favorite on', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleFavorite(testId);
    });

    expect(result.current.isFavorite(testId)).toBe(true);
    expect(result.current.count).toBe(1);
  });

  it('toggles favorite off', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleFavorite(testId);
      result.current.toggleFavorite(testId);
    });

    expect(result.current.isFavorite(testId)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('handles multiple favorites', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleFavorite(testId);
      result.current.toggleFavorite(testId2);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite(testId)).toBe(true);
    expect(result.current.isFavorite(testId2)).toBe(true);
  });

  it('checks isFavorite correctly', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFavorite(testId)).toBe(false);

    act(() => {
      result.current.toggleFavorite(testId);
    });

    expect(result.current.isFavorite(testId)).toBe(true);
  });
});
