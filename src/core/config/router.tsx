import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from './routes.config';

const HomePage = lazy(() => import('@/pages/home-page'));
const CharactersPage = lazy(() => import('@/pages/characters-page'));
const CharacterDetailPage = lazy(() => import('@/pages/character-detail-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

/**
 * Loading fallback component for lazy-loaded pages.
 */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status" />
        <p className="mt-4 text-sm text-neutral-600">Loading page...</p>
      </div>
    </div>
  );
}

/**
 * Application router configuration.
 * Uses React Router v6 with lazy loading for optimal performance.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CHARACTERS,
    element: (
      <Suspense fallback={<PageLoader />}>
        <CharactersPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CHARACTER_DETAIL,
    element: (
      <Suspense fallback={<PageLoader />}>
        <CharacterDetailPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.FAVORITES,
    element: (
      <Suspense fallback={<PageLoader />}>
        {/* Redirect to characters page for unified view */}
        <CharactersPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.DELETED,
    element: (
      <Suspense fallback={<PageLoader />}>
        {/* Redirect to characters page for unified view */}
        <CharactersPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
