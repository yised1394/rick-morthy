import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/routes.config';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { useSoftDeleteCharacters } from '@/features/soft-delete/hooks/use-soft-delete-characters';
import { useView } from '@/features/characters/context/view-context';

/**
 * Application header with navigation.
 * Uses icons for Favorites (heart) and Deleted (trash) with colored badges.
 * Icons switch views instead of navigating to separate routes.
 */
export function Header() {
  const { count } = useFavorites();
  const { deletedCount } = useSoftDeleteCharacters();
  const { view, setView } = useView();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-xl font-bold text-brand no-underline"
        >
          <span className="text-2xl" aria-hidden="true">🧪</span>
          <span className="hidden sm:inline">R&M Explorer</span>
        </Link>

        <nav className="flex items-center gap-4">
          {/* Characters - All View */}
          <button
            type="button"
            onClick={() => setView('all')}
            className={`text-sm font-medium transition-colors hover:text-brand ${
              view === 'all' ? 'text-brand' : 'text-neutral-600'
            }`}
          >
            Characters
          </button>

          {/* Favorites - Heart Icon */}
          <button
            type="button"
            onClick={() => setView('favorites')}
            className={`relative p-2 rounded-lg transition-colors ${
              view === 'favorites' ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
            aria-label={`Favorites (${count})`}
          >
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Deleted - Trash Icon */}
          <button
            type="button"
            onClick={() => setView('deleted')}
            className={`relative p-2 rounded-lg transition-colors ${
              view === 'deleted' ? 'bg-red-50' : 'hover:bg-gray-50'
            }`}
            aria-label={`Deleted (${deletedCount})`}
          >
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {deletedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {deletedCount > 99 ? '99+' : deletedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
