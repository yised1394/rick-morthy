import type { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../config/apollo.config';
import { FavoritesProvider } from '@/features/favorites/context/favorites-context';

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
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </ApolloProvider>
  );
}
