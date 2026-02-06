import { useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

interface CommentFormProps {
  readonly onSubmit: (text: string, author: string) => void;
}

/**
 * Form for adding new comments.
 */
export function CommentForm({ onSubmit }: CommentFormProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState<{ text?: string; author?: string }>({});

  const validate = (): boolean => {
    const newErrors: { text?: string; author?: string } = {};

    if (!text.trim()) {
      newErrors.text = 'Comment is required';
    } else if (text.trim().length < 3) {
      newErrors.text = 'Comment must be at least 3 characters';
    } else if (text.trim().length > 500) {
      newErrors.text = 'Comment must be less than 500 characters';
    }

    if (!author.trim()) {
      newErrors.author = 'Name is required';
    } else if (author.trim().length < 2) {
      newErrors.author = 'Name must be at least 2 characters';
    } else if (author.trim().length > 50) {
      newErrors.author = 'Name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validate()) {
      onSubmit(text.trim(), author.trim());
      setText('');
      setAuthor('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Your name"
        placeholder="Enter your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        error={errors.author}
        maxLength={50}
      />

      <div>
        <label
          htmlFor="comment-text"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Comment
        </label>
        <textarea
          id="comment-text"
          placeholder="Share your thoughts about this character..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          rows={3}
          className={`
            input resize-none
            ${errors.text ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
          `}
          aria-invalid={errors.text ? 'true' : undefined}
          aria-describedby={errors.text ? 'comment-text-error' : undefined}
        />
        {errors.text && (
          <p
            id="comment-text-error"
            className="mt-1 text-sm text-danger"
            role="alert"
          >
            {errors.text}
          </p>
        )}
        <p className="mt-1 text-xs text-neutral-500">
          {text.length}/500 characters
        </p>
      </div>

      <Button type="submit">Post Comment</Button>
    </form>
  );
}
