import { useState } from 'react';
import { toast } from 'sonner';
import type { CharacterId } from '@/core/types/global.types';
import { useComments } from '../hooks/use-comments';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';

interface CommentSectionProps {
  readonly characterId: CharacterId;
}

/**
 * Complete comment section with list above form.
 * Features:
 * - Comments list above form (newest first)
 * - "Add Comment" button when no comments
 * - Toast notifications for all actions
 */
export function CommentSection({ characterId }: CommentSectionProps) {
  const { comments, addNewComment, editComment, removeComment, isLoading, count } = useComments(characterId);
  const [showForm, setShowForm] = useState(false);

  const handleAddComment = (text: string, author: string) => {
    addNewComment(text, author);
    toast.success('Comment added');
    setShowForm(false);
  };

  return (
    <section className="space-y-6 py-6" aria-labelledby="comments-heading">
      <div className="flex items-center justify-between">
        <h2 id="comments-heading" className="text-xl font-semibold text-foreground">
          Comments {count > 0 && `(${count})`}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8 text-gray-500">
          <p>Loading comments...</p>
        </div>
      ) : (
        <>
          {/* Comments list (above form) */}
          <CommentList comments={comments} onDelete={removeComment} onEdit={editComment} />

          {/* Form or Add button */}
          {showForm || count === 0 ? (
            <div className="rounded-lg bg-card p-6 shadow-md">
              {count === 0 && !showForm ? (
                <div className="text-center">
                  <p className="text-neutral-500 mb-4">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Comment
                  </button>
                </div>
              ) : (
                <>
                  <CommentForm onSubmit={handleAddComment} />
                  {count > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="mt-3 text-sm text-neutral-500 hover:text-neutral-700"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Comment
            </button>
          )}
        </>
      )}
    </section>
  );
}
