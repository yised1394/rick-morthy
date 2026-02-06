import { RouterProvider } from 'react-router-dom';
import { router } from './core/config/router';
import { AppProviders } from './core/providers/app-providers';
import { ErrorBoundary } from './shared/components/error-boundary';

/**
 * Root application component.
 * Wraps the app with providers and error boundary.
 */
export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
