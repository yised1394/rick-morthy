import { useEffect, useState } from 'react';

type DisplayMode = 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen';

/**
 * Hook to detect if app is running as installed PWA.
 * Useful for conditional UI rendering.
 *
 * @returns Current display mode
 *
 * @example
 * ```tsx
 * const displayMode = usePWADisplayMode();
 * const isPWA = displayMode === 'standalone';
 * ```
 */
export function usePWADisplayMode(): DisplayMode {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    if (typeof window === 'undefined') return 'browser';

    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone';
    }
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen';
    }
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui';
    }
    return 'browser';
  });

  useEffect(() => {
    const queries: Array<[DisplayMode, MediaQueryList]> = [
      ['standalone', window.matchMedia('(display-mode: standalone)')],
      ['fullscreen', window.matchMedia('(display-mode: fullscreen)')],
      ['minimal-ui', window.matchMedia('(display-mode: minimal-ui)')],
    ];

    const handlers = queries.map(([mode, query]) => {
      const handler = (event: MediaQueryListEvent) => {
        if (event.matches) {
          setDisplayMode(mode);
        }
      };
      query.addEventListener('change', handler);
      return () => query.removeEventListener('change', handler);
    });

    return () => {
      handlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return displayMode;
}
