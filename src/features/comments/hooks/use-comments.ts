import { useState, useCallback, useEffect } from 'react';
import type { CharacterId } from '@/core/types/global.types';
import type { Comment, NewComment } from '../types/comment.types';
import {
  getCommentsByCharacterId,
  addComment,
  deleteComment as deleteCommentFromStorage,
} from '../services/comments.storage';

/**
 * Hook to manage comments for a specific character.
 *
 * @param characterId - Character ID to manage comments for
 * @returns Comments state and actions
 *
 * @example
 * ```tsx
 * const { comments, addNewComment, removeComment, isLoading } = useComments(characterId);
 * ```
 */
export function useComments(characterId: CharacterId) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const stored = getCommentsByCharacterId(characterId);
    setComments(stored);
    setIsLoading(false);
  }, [characterId]);

  const addNewComment = useCallback(
    (text: string, author: string) => {
      const newComment: NewComment = {
        characterId,
        text,
        author,
      };

      const created = addComment(newComment);
      setComments((prev) => [...prev, created]);

      return created;
    },
    [characterId]
  );

  const removeComment = useCallback(
    (commentId: Comment['id']) => {
      deleteCommentFromStorage(characterId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    },
    [characterId]
  );

  return {
    comments,
    addNewComment,
    removeComment,
    isLoading,
    count: comments.length,
  };
}
