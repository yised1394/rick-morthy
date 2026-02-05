import { MainLayout } from '@/shared/components/layout/main-layout';
import { CharacterExplorer } from '@/features/characters/components/character-explorer';

/**
 * Characters list page with search, filter, and pagination.
 * Uses the new Figma-based design with split layout on desktop.
 */
function CharactersPage() {
  return (
    <MainLayout>
      <CharacterExplorer />
    </MainLayout>
  );
}

export default CharactersPage;
