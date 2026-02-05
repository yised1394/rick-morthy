import type { CharacterId, CommentId } from '@/core/types/global.types';

/**
 * Comment entity.
 */
export interface Comment {
  readonly id: CommentId;
  readonly characterId: CharacterId;
  readonly text: string;
  readonly author: string;
  readonly createdAt: string;
}

/**
 * New comment input (before ID is assigned).
 */
export interface NewComment {
  readonly characterId: CharacterId;
  readonly text: string;
  readonly author: string;
}

/**
 * Comments storage structure by character ID.
 */
export type CommentsStorage = Record<string, Comment[]>;
