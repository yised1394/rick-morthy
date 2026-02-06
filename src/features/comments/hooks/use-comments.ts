import { useState, useCallback, useEffect } from 'react';
import type { CharacterId } from '@/core/types/global.types';
import type { Comment, NewComment } from '../types/comment.types';
import {
  getCommentsByCharacterId,
  addComment,
  deleteComment as deleteCommentFromStorage,
  updateComment as updateCommentInStorage,
} from '../services/comments.storage';

/**
 * Hook to manage comments for a specific character.
 *
 * @param characterId - Character ID to manage comments for
 * @returns Comments state and actions
 *
 * @example
 * ```tsx
 * const { comments, addNewComment, editComment, removeComment, isLoading } = useComments(characterId);
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
      setComments((prev) => [created, ...prev]); // Add to beginning for newest first

      return created;
    },
    [characterId]
  );

  const editComment = useCallback(
    (commentId: Comment['id'], newText: string) => {
      const updated = updateCommentInStorage(characterId, commentId, newText);
      if (updated) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updated : c))
        );
      }
      return updated;
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
    editComment,
    removeComment,
    isLoading,
    count: comments.length,
  };
}
