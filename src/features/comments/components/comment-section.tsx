import type { CharacterId } from '@/core/types/global.types';
import { useComments } from '../hooks/use-comments';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

interface CommentSectionProps {
  readonly characterId: CharacterId;
}

/**
 * Complete comment section with form and list.
 */
export function CommentSection({ characterId }: CommentSectionProps) {
  const { comments, addNewComment, removeComment, isLoading, count } = useComments(characterId);

  return (
    <section className="space-y-6" aria-labelledby="comments-heading">
      <div className="flex items-center justify-between">
        <h2 id="comments-heading" className="text-xl font-semibold text-foreground">
          Comments {count > 0 && `(${count})`}
        </h2>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-md">
        <CommentForm onSubmit={addNewComment} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <CommentList comments={comments} onDelete={removeComment} />
      )}
    </section>
  );
}
