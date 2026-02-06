import { CommentItem } from './comment-item';
import type { Comment } from '../types/comment.types';

interface CommentListProps {
  readonly comments: readonly Comment[];
  readonly onDelete: (id: Comment['id']) => void;
  readonly onEdit: (id: Comment['id'], newText: string) => void;
}

/**
 * List of comments with edit and delete functionality.
 */
export function CommentList({ comments, onDelete, onEdit }: CommentListProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
