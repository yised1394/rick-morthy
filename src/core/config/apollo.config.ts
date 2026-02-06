import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

/**
 * Rick and Morty GraphQL API endpoint.
 */
const GRAPHQL_ENDPOINT = 'https://rickandmortyapi.com/graphql';

/**
 * HTTP link for GraphQL requests.
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

/**
 * Retry link with exponential backoff for rate limiting (429 errors).
 * Implements intelligent retry logic with jittered delays.
 */
const retryLink = new RetryLink({
  delay: {
    initial: 1000,
    max: 4000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors or 429 status codes
      const is429 = error?.statusCode === 429;
      const isNetworkError = !!error && !error.result;
      return is429 || isNetworkError;
    },
  },
});

/**
 * Error handling link.
 * Logs GraphQL and network errors for debugging.
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
    // Special handling for rate limit errors
    if ('statusCode' in networkError && networkError.statusCode === 429) {
      console.warn('[Rate Limit]: Too many requests. Retrying with backoff...');
    } else {
      console.error(`[Network error]: ${networkError}`);
    }
  }
});

/**
 * Apollo Client cache configuration.
 * Configures type policies for optimal caching and pagination.
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: {
          keyArgs: ['filter'],
          merge(existing, incoming) {
            if (!existing) return incoming;
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

/**
 * Apollo Client instance configured for Rick and Morty API.
 * Includes retry logic, error handling and optimized caching.
 */
export const apolloClient = new ApolloClient({
  link: from([retryLink, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

