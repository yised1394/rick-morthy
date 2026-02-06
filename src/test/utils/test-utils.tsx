import type { ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { MockedProvider, type MockedProviderProps } from '@apollo/client/testing';
import { SoftDeleteProvider } from '@/features/soft-delete/context/soft-delete-context';
import { FavoritesProvider } from '@/features/favorites/context/favorites-context';

/**
 * Props for the custom render function.
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Apollo GraphQL mocks */
  readonly mocks?: MockedProviderProps['mocks'];
  /** Initial router entries for MemoryRouter */
  readonly initialEntries?: MemoryRouterProps['initialEntries'];
}

/**
 * All providers wrapper for testing.
 * Provides Apollo, Router, SoftDelete, and Favorites contexts.
 */
function AllProviders({
  children,
  mocks = [],
  initialEntries = ['/'],
}: {
  readonly children: ReactNode;
  readonly mocks?: MockedProviderProps['mocks'];
  readonly initialEntries?: MemoryRouterProps['initialEntries'];
}) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={initialEntries}>
        <SoftDeleteProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </SoftDeleteProvider>
      </MemoryRouter>
    </MockedProvider>
  );
}

/**
 * Custom render function that wraps components with all necessary providers.
 *
 * @param ui - The React element to render
 * @param options - Render options including mocks and router entries
 * @returns The render result from @testing-library/react
 *
 * @example
 * ```tsx
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   mocks: [myGraphQLMock],
 *   initialEntries: ['/characters/1'],
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactNode,
  { mocks, initialEntries, ...renderOptions }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks} initialEntries={initialEntries}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Re-export everything from @testing-library/react for convenience.
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
