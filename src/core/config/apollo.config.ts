import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

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
    console.error(`[Network error]: ${networkError}`);
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
 * Includes error handling and optimized caching.
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
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
