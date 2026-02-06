import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SoftDeleteProvider } from '@/features/soft-delete/context/soft-delete-context';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { createCharacterId } from '@/core/types/global.types';

/**
 * Wrapper component that provides SoftDeleteProvider context.
 */
function createWrapper() {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return <SoftDeleteProvider>{children}</SoftDeleteProvider>;
  };
}

describe('useSoftDeleteCharacters', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with empty deleted character IDs', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.deletedCharacterIds.size).toBe(0);
    expect(result.current.deletedCount).toBe(0);
  });

  it('marks a character as deleted using markAsDeleted', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('1');

    // Act
    act(() => {
      result.current.markAsDeleted(characterId);
    });

    // Assert
    expect(result.current.deletedCharacterIds.has(characterId)).toBe(true);
    expect(result.current.deletedCount).toBe(1);
  });

  it('returns true for isDeleted when character is deleted', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('42');

    // Act
    act(() => {
      result.current.markAsDeleted(characterId);
    });

    // Assert
    expect(result.current.isDeleted(characterId)).toBe(true);
  });

  it('returns false for isDeleted when character is not deleted', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('1');

    // Assert
    expect(result.current.isDeleted(characterId)).toBe(false);
  });

  it('restores a deleted character using restoreCharacter', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('1');

    // First delete the character
    act(() => {
      result.current.markAsDeleted(characterId);
    });
    expect(result.current.isDeleted(characterId)).toBe(true);

    // Act - restore the character
    act(() => {
      result.current.restoreCharacter(characterId);
    });

    // Assert
    expect(result.current.isDeleted(characterId)).toBe(false);
    expect(result.current.deletedCount).toBe(0);
  });

  it('persists state between re-renders', () => {
    // Arrange
    const { result, rerender } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('5');

    // Act
    act(() => {
      result.current.markAsDeleted(characterId);
    });
    rerender();

    // Assert
    expect(result.current.isDeleted(characterId)).toBe(true);
  });

  it('handles multiple delete operations correctly', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const char1 = createCharacterId('1');
    const char2 = createCharacterId('2');
    const char3 = createCharacterId('3');

    // Act - delete multiple characters
    act(() => {
      result.current.markAsDeleted(char1);
      result.current.markAsDeleted(char2);
      result.current.markAsDeleted(char3);
    });

    // Assert
    expect(result.current.deletedCount).toBe(3);
    expect(result.current.isDeleted(char1)).toBe(true);
    expect(result.current.isDeleted(char2)).toBe(true);
    expect(result.current.isDeleted(char3)).toBe(true);
  });

  it('handles mixed delete and restore operations correctly', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const char1 = createCharacterId('1');
    const char2 = createCharacterId('2');

    // Act - delete both
    act(() => {
      result.current.markAsDeleted(char1);
      result.current.markAsDeleted(char2);
    });

    // Restore one
    act(() => {
      result.current.restoreCharacter(char1);
    });

    // Assert
    expect(result.current.isDeleted(char1)).toBe(false);
    expect(result.current.isDeleted(char2)).toBe(true);
    expect(result.current.deletedCount).toBe(1);
  });

  it('does not throw when restoring a non-deleted character', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('999');

    // Act & Assert - should not throw
    expect(() => {
      act(() => {
        result.current.restoreCharacter(characterId);
      });
    }).not.toThrow();
  });

  it('saves deleted IDs to localStorage', () => {
    // Arrange
    const { result } = renderHook(() => useSoftDeleteCharacters(), {
      wrapper: createWrapper(),
    });
    const characterId = createCharacterId('1');

    // Act
    act(() => {
      result.current.markAsDeleted(characterId);
    });

    // Assert - check localStorage directly
    const storedValue = localStorage.getItem('rickandmorty_deleted');
    expect(storedValue).not.toBeNull();
    expect(storedValue).toContain('1');
  });
});
