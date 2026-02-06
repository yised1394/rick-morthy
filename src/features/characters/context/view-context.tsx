import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ExplorerView } from '../types/character-filter.types';

interface ViewContextValue {
  readonly view: ExplorerView;
  readonly setView: (view: ExplorerView) => void;
}

const ViewContext = createContext<ViewContextValue | null>(null);

interface ViewProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider for explorer view state.
 * Enables switching between all characters, favorites, and deleted views.
 */
export function ViewProvider({ children }: ViewProviderProps) {
  const [view, setViewState] = useState<ExplorerView>('all');

  const setView = useCallback((newView: ExplorerView) => {
    // Use View Transitions API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setViewState(newView);
      });
    } else {
      setViewState(newView);
    }
  }, []);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

/**
 * Hook to access and control the explorer view.
 */
export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
