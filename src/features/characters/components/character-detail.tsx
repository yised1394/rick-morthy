import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterById } from '../hooks/use-character-by-id';
import { Badge, getStatusVariant } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';
import { CommentSection } from '@/features/comments/components/comment-section';
import { formatCharacterDate, getStatusColorClass } from '../utils/character.utils';
import { ROUTES } from '@/core/config/routes.config';

/**
 * Character detail view with full information and comments.
 */
export function CharacterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useCharacterById(id ?? '');

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load character"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.character) {
    return (
      <ErrorMessage
        title="Character not found"
        message="The character you're looking for doesn't exist."
        onRetry={() => navigate(ROUTES.CHARACTERS)}
      />
    );
  }

  const character = data.character;

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={character.image}
              alt={character.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-4 top-4">
              <FavoriteButton characterId={character.id} size="lg" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`h-3 w-3 rounded-full ${getStatusColorClass(character.status)}`}
                aria-hidden="true"
              />
              <Badge variant={getStatusVariant(character.status)}>
                {character.status}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              {character.name}
            </h1>

            {character.type && (
              <p className="mt-1 text-neutral-600">{character.type}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Species" value={character.species} />
            <InfoItem label="Gender" value={character.gender} />
            <InfoItem label="Origin" value={character.origin.name} />
            <InfoItem label="Location" value={character.location.name} />
            <InfoItem
              label="Created"
              value={formatCharacterDate(character.created)}
            />
            <InfoItem
              label="Episodes"
              value={`${character.episode.length} episode${character.episode.length !== 1 ? 's' : ''}`}
            />
          </div>

          {character.episode.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Episodes
              </h2>
              <div className="flex flex-wrap gap-2">
                {character.episode.slice(0, 10).map((ep) => (
                  <span
                    key={ep.id}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    title={ep.name}
                  >
                    {ep.episode}
                  </span>
                ))}
                {character.episode.length > 10 && (
                  <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    +{character.episode.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CommentSection characterId={character.id} />
    </div>
  );
}

interface InfoItemProps {
  readonly label: string;
  readonly value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-neutral-500">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
