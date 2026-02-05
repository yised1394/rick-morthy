import { MainLayout } from '@/shared/components/layout/main-layout';
import { CharacterList } from '@/features/characters/components/character-list';

/**
 * Characters list page with search, filter, and pagination.
 */
function CharactersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Characters</h1>
          <p className="mt-2 text-neutral-600">
            Browse all characters from the Rick and Morty universe
          </p>
        </div>

        <CharacterList />
      </div>
    </MainLayout>
  );
}

export default CharactersPage;
