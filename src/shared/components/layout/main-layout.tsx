import type { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { OfflineIndicator } from '@/shared/components/pwa/offline-indicator';
import { PWAUpdatePrompt } from '@/shared/components/pwa/pwa-update-prompt';
import { InstallPrompt } from '@/shared/components/pwa/install-prompt';

interface MainLayoutProps {
  readonly children: ReactNode;
}

/**
 * Main application layout with header, footer, and PWA components.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineIndicator />
      <Header />

      <main className="container flex-1 py-8">
        {children}
      </main>

      <Footer />

      <PWAUpdatePrompt />
      <InstallPrompt />
    </div>
  );
}
