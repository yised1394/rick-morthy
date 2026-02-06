# GraphQL API Documentation

## Overview

The Rick and Morty Character Explorer uses the official [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) to fetch character data.

**API Endpoint:**
```
https://rickandmortyapi.com/graphql
```

## Configuration

The API is configured in `src/core/config/apollo.config.ts`:

```typescript
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_ENDPOINT,
  fetchOptions: {
    mode: 'cors',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Features
- ✅ CORS-compliant requests
- ✅ Retry logic with exponential backoff
- ✅ Automatic error handling
- ✅ Response caching
- ✅ Environment-based configuration

## Queries

### 1. Get Characters (Paginated)

Fetches a paginated list of characters with optional filters.

**Query:**
```graphql
query GetCharacters(
  $page: Int
  $filter: FilterCharacter
) {
  characters(page: $page, filter: $filter) {
    info {
      count
      pages
      next
      prev
    }
    results {
      id
      name
      status
      species
      type
      gender
      image
      created
    }
  }
}
```

**Variables:**
```json
{
  "page": 1,
  "filter": {
    "name": "Rick",
    "status": "Alive",
    "species": "Human",
    "gender": "Male"
  }
}
```

**Response:**
```json
{
  "data": {
    "characters": {
      "info": {
        "count": 826,
        "pages": 42,
        "next": 2,
        "prev": null
      },
      "results": [
        {
          "id": "1",
          "name": "Rick Sanchez",
          "status": "Alive",
          "species": "Human",
          "type": "",
          "gender": "Male",
          "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          "created": "2017-11-04T18:48:46.250Z"
        }
      ]
    }
  }
}
```

**Usage in App:**
```typescript
const { data, loading, error } = useQuery(GET_CHARACTERS, {
  variables: {
    page: currentPage,
    filter: {
      name: searchTerm,
      status: statusFilter,
      species: speciesFilter,
      gender: genderFilter,
    },
  },
});
```

---

### 2. Get Character by ID

Fetches detailed information for a single character.

**Query:**
```graphql
query GetCharacterById($id: ID!) {
  character(id: $id) {
    id
    name
    status
    species
    type
    gender
    origin {
      name
      type
      dimension
    }
    location {
      name
      type
      dimension
    }
    image
    episode {
      id
      name
      air_date
      episode
    }
    created
  }
}
```

**Variables:**
```json
{
  "id": "1"
}
```

**Response:**
```json
{
  "data": {
    "character": {
      "id": "1",
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "type": "",
      "gender": "Male",
      "origin": {
        "name": "Earth (C-137)",
        "type": "Planet",
        "dimension": "Dimension C-137"
      },
      "location": {
        "name": "Citadel of Ricks",
        "type": "Space station",
        "dimension": "unknown"
      },
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "episode": [
        {
          "id": "1",
          "name": "Pilot",
          "air_date": "December 2, 2013",
          "episode": "S01E01"
        }
      ],
      "created": "2017-11-04T18:48:46.250Z"
    }
  }
}
```

**Usage in App:**
```typescript
const { data, loading } = useQuery(GET_CHARACTER_BY_ID, {
  variables: { id: characterId },
});
```

---

### 3. Get Characters by IDs

Fetches multiple characters by their IDs (used for favorites).

**Query:**
```graphql
query GetCharactersByIds($ids: [ID!]!) {
  charactersByIds(ids: $ids) {
    id
    name
    status
    species
    gender
    image
    created
  }
}
```

**Variables:**
```json
{
  "ids": ["1", "2", "3"]
}
```

**Usage in App:**
```typescript
const { data } = useQuery(GET_CHARACTERS_BY_IDS, {
  variables: { ids: Array.from(favoriteIds) },
  skip: favoriteIds.size === 0,
});
```

## Available Filters

### Character Filter Options

| Field | Type | Options |
|-------|------|---------|
| `name` | String | Any character name (partial match) |
| `status` | String | `"Alive"`, `"Dead"`, `"unknown"` |
| `species` | String | `"Human"`, `"Alien"`, etc. |
| `type` | String | Character sub-type |
| `gender` | String | `"Male"`, `"Female"`, `"Genderless"`, `"unknown"` |

### Example Filters

**Find all alive humans:**
```json
{
  "filter": {
    "status": "Alive",
    "species": "Human"
  }
}
```

**Search by name:**
```json
{
  "filter": {
    "name": "Morty"
  }
}
```

**Complex filter:**
```json
{
  "filter": {
    "name": "Rick",
    "status": "Alive",
    "species": "Human",
    "gender": "Male"
  }
}
```

## Response Schema

### Info Object

Information about the paginated results.

```typescript
interface Info {
  count: number;  // Total number of characters
  pages: number;  // Total number of pages
  next: number | null;  // Next page number
  prev: number | null;  // Previous page number
}
```

### Character Object

Complete character data structure.

```typescript
interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Male' | 'Female' | 'Genderless' | 'unknown';
  origin: Location;
  location: Location;
  image: string;
  episode: Episode[];
  created: string;
}

interface Location {
  name: string;
  type: string;
  dimension: string;
}

interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}
```

## Caching Strategy

### Apollo Cache Configuration

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: {
          keyArgs: ['filter'],  // Cache by filter
          merge(existing, incoming) {
            return incoming;  // Replace strategy
          },
        },
      },
    },
    Character: {
      keyFields: ['id'],  // Cache by ID
    },
  },
});
```

### Fetch Policies

- **cache-first** (default) - Use cache if available
- **cache-and-network** - Return cache + update from network
- **network-only** - Always fetch from network
- **no-cache** - Skip cache entirely

**Usage:**
```typescript
useQuery(GET_CHARACTERS, {
  fetchPolicy: 'cache-and-network',
});
```

## Error Handling

### Network Errors

Handled by `RetryLink`:

```typescript
const retryLink = new RetryLink({
  delay: {
    initial: 1000,
    max: 4000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      const is429 = error?.statusCode === 429;
      const is5xx = error?.statusCode >= 500;
      return is429 || is5xx;
    },
  },
});
```

### GraphQL Errors

Logged by `ErrorLink`:

```typescript
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
```

## Rate Limiting

The Rick and Morty API has no documented rate limits, but our retry logic handles potential 429 errors:

- **Initial delay:** 1 second
- **Max delay:** 4 seconds
- **Max retries:** 3 attempts
- **Exponential backoff** with jitter

## Best Practices

### 1. Use TypeScript Types

```typescript
import type { GetCharactersQuery, GetCharactersQueryVariables } from '../types/character-query.types';

const { data } = useQuery<GetCharactersQuery, GetCharactersQueryVariables>(
  GET_CHARACTERS,
  { variables }
);
```

### 2. Handle Loading States

```typescript
if (loading) return <CharacterListSkeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;
```

### 3. Optimize Queries

- Request only needed fields
- Use pagination
- Leverage caching
- Skip queries when not needed

```typescript
useQuery(GET_CHARACTERS, {
  skip: !isVisible,  // Don't fetch if tab is hidden
});
```

### 4. Batch Requests

For multiple characters, use `charactersByIds` instead of multiple single requests:

```typescript
// ❌ Bad - Multiple requests
favoriteIds.forEach(id => {
  useQuery(GET_CHARACTER_BY_ID, { variables: { id } });
});

// ✅ Good - Single batched request
useQuery(GET_CHARACTERS_BY_IDS, {
  variables: { ids: Array.from(favoriteIds) },
});
```

## Testing

### Mock Apollo Provider

```typescript
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: GET_CHARACTERS,
      variables: { page: 1 },
    },
    result: {
      data: {
        characters: {
          info: { count: 1, pages: 1, next: null, prev: null },
          results: [mockCharacter],
        },
      },
    },
  },
];

<MockedProvider mocks={mocks}>
  <YourComponent />
</MockedProvider>
```

## References

- **Official API:** https://rickandmortyapi.com/
- **GraphQL Playground:** https://rickandmortyapi.com/graphql
- **Apollo Client Docs:** https://www.apollographql.com/docs/react/
- **GraphQL Docs:** https://graphql.org/

---

**Last Updated:** 2026-02-06  
**API Version:** Latest
