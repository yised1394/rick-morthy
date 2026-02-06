
/**
 * Simple queue to limit concurrent async operations.
 * Used to throttle image requests and prevent 429 errors.
 */
class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeCount = 0;
  private maxConcurrent: number;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Add a task to the queue.
   * @param task A function that returns a promise.
   */
  add<T>(task: () => Promise<T>, dedupeKey?: string): Promise<T> {
    // Deduplication logic: return existing promise if same key is in flight
    if (dedupeKey && this.pendingRequests.has(dedupeKey)) {
      return this.pendingRequests.get(dedupeKey) as Promise<T>;
    }

    const promise = new Promise<T>((resolve, reject) => {
      const wrappedTask = async () => {
        this.activeCount++;
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          // Critical: Always clean up dedupe key
          if (dedupeKey) {
            this.pendingRequests.delete(dedupeKey);
          }
          this.activeCount--;
          this.next();
        }
      };

      this.queue.push(wrappedTask);
      this.next();
    });

    if (dedupeKey) {
      this.pendingRequests.set(dedupeKey, promise);
    }

    return promise;
  }

  private next() {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (task) {
      task();
    }
  }
}

// Global instance to be shared across components
export const imageRequestQueue = new RequestQueue(3); // Max 3 concurrent image requests
