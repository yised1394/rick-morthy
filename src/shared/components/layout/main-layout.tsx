import type { ReactNode } from 'react';
import { OfflineIndicator } from '@/shared/components/pwa/offline-indicator';
import { PWAUpdatePrompt } from '@/shared/components/pwa/pwa-update-prompt';
import { InstallPrompt } from '@/shared/components/pwa/install-prompt';

interface MainLayoutProps {
  readonly children: ReactNode;
}

/**
 * Main application layout with PWA components.
 * Provides fullscreen experience without header/footer.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <OfflineIndicator />

      <main className="flex-1 w-full">
        {children}
      </main>

      <PWAUpdatePrompt />
      <InstallPrompt />
    </div>
  );
}

