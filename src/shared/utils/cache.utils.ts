/**
 * Clear all app caches (useful for logout or data reset).
 */
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log('All caches cleared');
  }
}

/**
 * Get total cache size (approximation).
 */
export async function getCacheSize(): Promise<number> {
  if ('caches' in window && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage ?? 0;
  }
  return 0;
}

/**
 * Check if cache quota is running low.
 */
export async function isCacheQuotaLow(): Promise<boolean> {
  if ('estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage ?? 0;
    const quota = estimate.quota ?? 0;
    const percentage = (usage / quota) * 100;

    return percentage > 80;
  }
  return false;
}

/**
 * Preload critical resources for offline use.
 */
export async function preloadCriticalResources(): Promise<void> {
  if ('caches' in window) {
    const cache = await caches.open('critical-resources');
    const criticalResources = ['/', '/characters', '/favorites'];

    await cache.addAll(criticalResources);
    console.log('Critical resources preloaded');
  }
}
