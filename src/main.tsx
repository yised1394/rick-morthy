import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/tailwind.css';
import { restoreCache } from '@/core/config/apollo.config';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Wait for cache to be restored before rendering
restoreCache().finally(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
