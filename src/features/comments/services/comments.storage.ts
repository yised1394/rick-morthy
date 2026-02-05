import { STORAGE_KEYS } from '@/shared/constants/app.constants';
import { createCommentId, type CharacterId, type CommentId } from '@/core/types/global.types';
import type { Comment, NewComment, CommentsStorage } from '../types/comment.types';

/**
 * Get all comments from localStorage.
 */
function getAllComments(): CommentsStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return stored ? (JSON.parse(stored) as CommentsStorage) : {};
  } catch {
    return {};
  }
}

/**
 * Save all comments to localStorage.
 */
function saveAllComments(comments: CommentsStorage): void {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
}

/**
 * Get comments for a specific character.
 *
 * @param characterId - Character ID to get comments for
 * @returns Array of comments for the character
 */
export function getCommentsByCharacterId(characterId: CharacterId): Comment[] {
  const allComments = getAllComments();
  return allComments[characterId] ?? [];
}

/**
 * Add a new comment for a character.
 *
 * @param newComment - Comment data to add
 * @returns The created comment with generated ID
 */
export function addComment(newComment: NewComment): Comment {
  const allComments = getAllComments();
  const characterComments = allComments[newComment.characterId] ?? [];

  const comment: Comment = {
    id: createCommentId(crypto.randomUUID()),
    characterId: newComment.characterId,
    text: newComment.text,
    author: newComment.author,
    createdAt: new Date().toISOString(),
  };

  allComments[newComment.characterId] = [...characterComments, comment];
  saveAllComments(allComments);

  return comment;
}

/**
 * Delete a comment by ID.
 *
 * @param characterId - Character ID the comment belongs to
 * @param commentId - Comment ID to delete
 */
export function deleteComment(characterId: CharacterId, commentId: CommentId): void {
  const allComments = getAllComments();
  const characterComments = allComments[characterId] ?? [];

  allComments[characterId] = characterComments.filter(
    (comment) => comment.id !== commentId
  );

  saveAllComments(allComments);
}

/**
 * Update an existing comment.
 *
 * @param characterId - Character ID the comment belongs to
 * @param commentId - Comment ID to update
 * @param newText - New text content for the comment
 * @returns The updated comment or null if not found
 */
export function updateComment(
  characterId: CharacterId,
  commentId: CommentId,
  newText: string
): Comment | null {
  const allComments = getAllComments();
  const characterComments = allComments[characterId] ?? [];

  const commentIndex = characterComments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return null;
  }

  const existingComment = characterComments[commentIndex]!;
  const updatedComment: Comment = {
    id: existingComment.id,
    characterId: existingComment.characterId,
    text: newText,
    author: existingComment.author,
    createdAt: existingComment.createdAt,
  };

  characterComments[commentIndex] = updatedComment;
  allComments[characterId] = characterComments;
  saveAllComments(allComments);

  return updatedComment;
}

/**
 * Delete all comments for a character.
 *
 * @param characterId - Character ID to delete comments for
 */
export function deleteAllCommentsForCharacter(characterId: CharacterId): void {
  const allComments = getAllComments();
  delete allComments[characterId];
  saveAllComments(allComments);
}
