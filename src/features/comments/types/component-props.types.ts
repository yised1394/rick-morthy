import type { Comment } from './comment.types';

/**
 * Props for CommentSection component.
 */
export interface CommentSectionProps {
  readonly characterId: string;
}

/**
 * Props for CommentList component.
 */
export interface CommentListProps {
  readonly comments: readonly Comment[];
  readonly onDelete: (id: string) => void;
  readonly onEdit: (id: string, text: string) => void;
}

/**
 * Props for CommentItem component.
 */
export interface CommentItemProps {
  readonly comment: Comment;
  readonly onDelete: (id: string) => void;
  readonly onEdit: (id: string, text: string) => void;
}

/**
 * Props for CommentForm component.
 */
export interface CommentFormProps {
  readonly onSubmit: (text: string, author: string) => void;
  readonly onCancel?: () => void;
  readonly initialText?: string;
  readonly initialAuthor?: string;
  readonly submitLabel?: string;
}
