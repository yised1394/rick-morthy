import type { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'sonner';
import { apolloClient } from '../config/apollo.config';
import { FavoritesProvider } from '@/features/favorites/context/favorites-context';
import { SoftDeleteProvider } from '@/features/soft-delete/context/soft-delete-context';
import { ViewProvider } from '@/features/characters/context/view-context';

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Root providers wrapper component.
 * Combines all necessary context providers for the application.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <SoftDeleteProvider>
        <FavoritesProvider>
          <ViewProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
            />
          </ViewProvider>
        </FavoritesProvider>
      </SoftDeleteProvider>
    </ApolloProvider>
  );
}

