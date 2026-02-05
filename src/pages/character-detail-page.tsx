import { MainLayout } from '@/shared/components/layout/main-layout';
import { CharacterDetail } from '@/features/characters/components/character-detail';

/**
 * Character detail page with full information and comments.
 */
function CharacterDetailPage() {
  return (
    <MainLayout>
      <CharacterDetail />
    </MainLayout>
  );
}

export default CharacterDetailPage;
