import { Button } from '@/shared/components/ui/button';
import type { Comment } from '../types/comment.types';

interface CommentItemProps {
  readonly comment: Comment;
  readonly onDelete: (id: Comment['id']) => void;
}

/**
 * Format comment date for display.
 */
function formatCommentDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Single comment display component.
 */
export function CommentItem({ comment, onDelete }: CommentItemProps) {
  return (
    <article className="rounded-md bg-muted p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-semibold">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{comment.author}</p>
            <p className="text-xs text-neutral-500">
              {formatCommentDate(comment.createdAt)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(comment.id)}
          aria-label="Delete comment"
          className="text-neutral-400 hover:text-danger"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>

      <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">
        {comment.text}
      </p>
    </article>
  );
}
