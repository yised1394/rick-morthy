import { CharacterExplorer } from '@/features/characters/components/character-explorer';
import { OfflineIndicator } from '@/shared/components/pwa/offline-indicator';
import { PWAUpdatePrompt } from '@/shared/components/pwa/pwa-update-prompt';
import { InstallPrompt } from '@/shared/components/pwa/install-prompt';

/**
 * Characters list page with search, filter, and pagination.
 * Clean layout without global header/footer — controls are integrated in the panel.
 */
function CharactersPage() {
  return (
    <div className="min-h-screen bg-white">
      <OfflineIndicator />
      <CharacterExplorer />
      <PWAUpdatePrompt />
      <InstallPrompt />
    </div>
  );
}

export default CharactersPage;
