import { CommentItem } from './comment-item';
import type { Comment } from '../types/comment.types';

interface CommentListProps {
  readonly comments: readonly Comment[];
  readonly onDelete: (id: Comment['id']) => void;
}

/**
 * List of comments with delete functionality.
 */
export function CommentList({ comments, onDelete }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-center text-neutral-500 py-8">
        No comments yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
