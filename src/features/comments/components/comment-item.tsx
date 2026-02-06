import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { ConfirmationModal } from '@/shared/components/ui/confirmation-modal';
import { EditIcon } from '@/shared/components/icons/edit-icon';
import { TrashIcon } from '@/shared/components/icons/trash-icon';
import type { Comment } from '../types/comment.types';

interface CommentItemProps {
  readonly comment: Comment;
  readonly onDelete: (id: Comment['id']) => void;
  readonly onEdit: (id: Comment['id'], newText: string) => void;
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
 * Single comment display component with edit and delete functionality.
 */
export function CommentItem({ comment, onDelete, onEdit }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setEditText(comment.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim().length < 3) {
      toast.error('Comment must be at least 3 characters');
      return;
    }
    if (editText.trim().length > 500) {
      toast.error('Comment must be less than 500 characters');
      return;
    }
    onEdit(comment.id, editText.trim());
    setIsEditing(false);
    toast.success('Comment updated');
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(comment.id);
    toast.success('Comment deleted');
  };

  return (
    <>
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

          {/* Action buttons */}
          {!isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                aria-label="Edit comment"
                className="text-neutral-400 hover:text-primary-600"
              >
                <EditIcon size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                aria-label="Delete comment"
                className="text-neutral-400 hover:text-danger"
              >
                <TrashIcon size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Comment text or edit form */}
        {isEditing ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={500}
              rows={3}
              className="input resize-none w-full"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">
            {comment.text}
          </p>
        )}
      </article>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment by ${comment.author}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
