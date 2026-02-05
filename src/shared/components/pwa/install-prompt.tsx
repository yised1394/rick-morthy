import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Component that prompts user to install PWA.
 * Shows "Add to Home Screen" suggestion.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED);
    if (dismissed) {
      const dismissedDate = parseInt(dismissed, 10);
      const daysSinceDismissal = (Date.now() - dismissedDate) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissal < 7) {
        return;
      }
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED, Date.now().toString());
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-title"
      className="
        fixed bottom-4 left-4 right-4 z-50
        max-w-md mx-auto rounded-lg bg-card p-6 shadow-2xl
        border border-neutral-200
        animate-slide-in
        sm:left-auto sm:right-4
      "
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="rounded-lg bg-brand/10 p-3">
            <svg
              className="h-6 w-6 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <h3 id="install-title" className="text-base font-semibold text-card-foreground">
            Install App
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Install Rick and Morty Explorer for quick access and offline use.
          </p>

          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleInstall} className="flex-1">
              Install
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDismiss}>
              Not Now
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
