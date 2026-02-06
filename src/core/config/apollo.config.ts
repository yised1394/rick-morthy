import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

/**
 * Rick and Morty GraphQL API endpoint from environment variables.
 * Falls back to hardcoded URL if env var is not set.
 */
const GRAPHQL_ENDPOINT = import.meta.env.DEV
  ? '/graphql' // Use proxy in dev
  : (import.meta.env.VITE_API_GRAPHQL_ENDPOINT || 'https://rickandmortyapi.com/graphql');

/**
 * HTTP link for GraphQL requests.
 * Simple configuration to avoid CORS preflight requests.
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

/**
 * Retry link with exponential backoff for rate limiting (429 errors).
 */
const retryLink = new RetryLink({
  delay: {
    initial: 2000, // Increased from 1000
    max: 10000,    // Increased from 4000
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      const is429 = error?.statusCode === 429;
      const is5xx = error?.statusCode && error.statusCode >= 500 && error.statusCode < 600;
      const isTimeout = error?.message?.includes('timeout');
      
      return is429 || is5xx || isTimeout;
    },
  },
});

/**
 * Error handling link.
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    if ('statusCode' in networkError && networkError.statusCode === 429) {
      console.warn('[Rate Limit]: Too many requests. Retrying with backoff...');
    } else {
      console.error(`[Network error]: ${networkError}`);
    }
  }
});

/**
 * Apollo Client cache configuration.
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: {
          keyArgs: ['filter'],
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Character: {
      keyFields: ['id'],
    },
  },
});

const client = new ApolloClient({
  link: from([retryLink, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first', // CRITICAL FIX: Was cache-and-network
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

// Initialize persistence
export const restoreCache = async () => {
  try {
    await persistCache({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
      trigger: 'write', 
      maxSize: 1048576 * 5,
    });

  } catch (error) {
    console.warn('Cache persistence failed initialization:', error);
  }
};

export const apolloClient = client;

