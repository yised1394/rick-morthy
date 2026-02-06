import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComments } from '@/features/comments/hooks/use-comments';
import { createCharacterId } from '@/core/types/global.types';

describe('useComments', () => {
  const characterId = createCharacterId('1');
  const characterId2 = createCharacterId('2');

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty comments for a character', () => {
    const { result } = renderHook(() => useComments(characterId));

    expect(result.current.comments).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('adds a comment to a character', () => {
    const { result } = renderHook(() => useComments(characterId));

    act(() => {
      result.current.addNewComment('Great character!', 'Test User');
    });

    expect(result.current.comments).toHaveLength(1);
    expect(result.current.comments[0]!.text).toBe('Great character!');
    expect(result.current.comments[0]!.author).toBe('Test User');
    expect(result.current.comments[0]!.characterId).toBe(characterId);
  });

  it('generates unique IDs for comments', () => {
    const { result } = renderHook(() => useComments(characterId));

    act(() => {
      result.current.addNewComment('Comment 1', 'User1');
      result.current.addNewComment('Comment 2', 'User2');
    });

    const ids = result.current.comments.map(c => c.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('adds timestamps to comments', () => {
    const { result } = renderHook(() => useComments(characterId));

    const beforeTime = Date.now();

    act(() => {
      result.current.addNewComment('Test comment', 'User');
    });

    const afterTime = Date.now();
    const commentTime = new Date(result.current.comments[0]!.createdAt).getTime();

    expect(commentTime).toBeGreaterThanOrEqual(beforeTime);
    expect(commentTime).toBeLessThanOrEqual(afterTime);
  });

  it('deletes a comment by ID', () => {
    const { result } = renderHook(() => useComments(characterId));

    act(() => {
      result.current.addNewComment('Comment to delete', 'User');
    });

    const commentId = result.current.comments[0]!.id;

    act(() => {
      result.current.removeComment(commentId);
    });

    expect(result.current.comments).toHaveLength(0);
  });

  it('separates comments by character ID', () => {
    const { result: result1 } = renderHook(() => useComments(characterId));
    const { result: result2 } = renderHook(() => useComments(characterId2));

    act(() => {
      result1.current.addNewComment('Comment for character 1', 'User1');
    });

    act(() => {
      result2.current.addNewComment('Comment for character 2', 'User2');
    });

    expect(result1.current.comments).toHaveLength(1);
    expect(result2.current.comments).toHaveLength(1);
    expect(result1.current.comments[0]!.text).toBe('Comment for character 1');
    expect(result2.current.comments[0]!.text).toBe('Comment for character 2');
  });
});
