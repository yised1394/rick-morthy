import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@/core/config/routes.config';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';

/**
 * Application header with navigation.
 */
export function Header() {
  const { count } = useFavorites();

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

        <nav className="flex items-center gap-6">
          <NavLink
            to={ROUTES.CHARACTERS}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-brand ${
                isActive ? 'text-brand' : 'text-neutral-600'
              }`
            }
          >
            Characters
          </NavLink>

          <NavLink
            to={ROUTES.FAVORITES}
            className={({ isActive }) =>
              `relative text-sm font-medium transition-colors hover:text-brand ${
                isActive ? 'text-brand' : 'text-neutral-600'
              }`
            }
          >
            Favorites
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
