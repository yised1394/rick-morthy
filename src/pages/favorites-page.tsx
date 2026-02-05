import { MainLayout } from '@/shared/components/layout/main-layout';
import { FavoritesList } from '@/features/favorites/components/favorites-list';

/**
 * Favorites page showing all saved characters.
 */
function FavoritesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
          <p className="mt-2 text-neutral-600">
            Your saved favorite characters
          </p>
        </div>

        <FavoritesList />
      </div>
    </MainLayout>
  );
}

export default FavoritesPage;
