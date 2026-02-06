# Architecture Overview

## System Design

The Rick and Morty Character Explorer follows a **feature-based architecture** with strict separation of concerns, adhering to SOLID principles and modern React best practices.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  React Router│  │  TailwindCSS │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      State Management Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Context API   │  │Custom Hooks  │  │ Local Storage│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       Data Access Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Apollo Client │  │  GraphQL API │  │ Error Handler│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│              Rick and Morty GraphQL API                      │
│          https://rickandmortyapi.com/graphql                 │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Feature-Based Organization

```
src/
├── core/                        # Core application setup
│   ├── config/                  # Configuration files
│   │   ├── apollo.config.ts     # GraphQL client setup
│   │   ├── router.tsx           # Routing configuration
│   │   ├── routes.config.ts     # Route definitions
│   │   └── pwa.config.ts        # PWA configuration
│   └── types/                   # Global type definitions
│       └── global.types.ts      # Branded types (CharacterId, etc.)
│
├── features/                    # Business features (domain-driven)
│   ├── characters/              # Character browsing & management
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Business logic hooks
│   │   ├── types/               # Feature-specific types
│   │   ├── utils/               # Helper functions
│   │   └── context/             # State management
│   │
│   ├── comments/                # Comment system
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── services/            # LocalStorage service
│   │
│   ├── favorites/               # Favorites management
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── context/
│   │
│   └── soft-delete/             # Soft delete functionality
│       ├── hooks/
│       ├── types/
│       └── context/
│
├── shared/                      # Shared/reusable code
│   ├── components/              # Generic UI components
│   │   ├── icons/               # SVG icon components
│   │   ├── layout/              # Layout components
│   │   ├── pwa/                 # PWA-related components
│   │   └── ui/                  # Base UI primitives
│   ├── constants/               # App-wide constants
│   └── utils/                   # Utility functions
│
├── pages/                       # Route page components
│   ├── home-page.tsx
│   ├── character-detail-page.tsx
│   ├── favorites-page.tsx
│   └── deleted-characters-page.tsx
│
└── test/                        # Test suites
    ├── features/                # Feature-specific tests
    ├── integration/             # Integration tests
    └── shared/                  # Shared component tests
```

## Design Patterns

### 1. Feature-Based Architecture

Each feature is self-contained with its own:
- Components (UI)
- Hooks (business logic)
- Types (type definitions)
- Services (data access)
- Context (state management)

**Benefits:**
- Easy to locate code
- Clear boundaries
- Independent testing
- Scalable growth

### 2. Context + Hooks Pattern

```typescript
// Context provides state
export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// Hook encapsulates business logic
export function useFavorites() {
  return useFavoritesContext();
}

// Components consume hooks
function CharacterCard() {
  const { toggleFavorite, isFavorite } = useFavorites();
  // ...
}
```

**Benefits:**
- Separation of concerns
- Reusable logic
- Testable in isolation
- Type-safe

### 3. Branded Types

```typescript
// Prevent accidental ID mixing
export type CharacterId = string & { readonly __brand: 'CharacterId' };
export type CommentId = string & { readonly __brand: 'CommentId' };

export function createCharacterId(id: string): CharacterId {
  return id as CharacterId;
}
```

**Benefits:**
- Type safety at compile time
- Prevents logic errors
- Self-documenting code

### 4. Atomic Type Organization

Types are split by concern:
- `character.types.ts` - Domain entities
- `character-query.types.ts` - GraphQL types
- `character-filter.types.ts` - UI filter types
- `component-props.types.ts` - Component interfaces

**Benefits:**
- SOLID principle (Single Responsibility)
- Easy to find types
- No circular dependencies
- Better tree-shaking

## State Management

### Local State (useState)
- Component-specific UI state
- Form inputs
- Modal visibility

### Context State
- Cross-component shared state
- Favorites
- Soft-deleted characters

### Server State (Apollo)
- Character data from API
- Automatic caching
- Optimistic updates

### Persistent State (LocalStorage)
- Favorites list
- Comments
- Deleted characters
- User preferences

## Data Flow

### Query Flow
```
Component → useCharacters hook → Apollo Client → GraphQL API
                                       ↓
                                  Cache (InMemory)
                                       ↓
                                   Component
```

### Mutation Flow (Favorites)
```
User Click → toggleFavorite → Update Context → Save to LocalStorage
                                    ↓
                              Re-render Components
```

## Type System

### Type Hierarchy

```
Core Types (global.types.ts)
    ↓
Domain Types (character.types.ts)
    ↓
Query Types (character-query.types.ts)
    ↓
UI Types (character-filter.types.ts)
    ↓
Component Props (component-props.types.ts)
```

### Type Safety Strategy

1. **Branded Types** - Prevent ID confusion
2. **Readonly Props** - Immutable component interfaces
3. **Strict Mode** - Enforce null checks
4. **No Any** - Zero `any` types in codebase
5. **Type Guards** - Runtime type validation

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── MainLayout
│   │   ├── PWA Components
│   │   └── Page Content
│   │       ├── HomePage
│   │       │   └── CharacterExplorer
│   │       │       ├── SearchBar
│   │       │       ├── CharacterFilters
│   │       │       ├── CharacterList
│   │       │       │   └── CharacterCard
│   │       │       └── Pagination
│   │       │
│   │       ├── CharacterDetailPage
│   │       │   ├── CharacterDetail
│   │       │   └── CommentSection
│   │       │
│   │       ├── FavoritesPage
│   │       └── DeletedCharactersPage
```

### Component Types

1. **Page Components** - Route handlers
2. **Feature Components** - Business logic
3. **Shared Components** - Reusable UI
4. **Icon Components** - SVG icons

## Error Handling

### Network Errors
- **Retry Link** - Exponential backoff for 429/5xx errors
- **Error Link** - Centralized error logging
- **Error Boundaries** - Catch React errors

### User Errors
- Form validation
- Empty state messages
- Helpful error messages

## Performance Optimizations

### React Optimizations
- `useCallback` for event handlers
- `useMemo` for expensive computations
- Code splitting with `React.lazy`
- Virtualization for long lists

### Network Optimizations
- Apollo cache-first policy
- GraphQL query batching
- Pagination (20 items/page)
- Image lazy loading

### Build Optimizations
- Vite bundle optimization
- Tree-shaking unused code
- CSS purging with Tailwind
- PWA asset caching

## Security Considerations

### Input Validation
- Sanitize user comments
- Validate search inputs
- Type-check all data

### Data Storage
- No sensitive data in LocalStorage
- Read-only API (no mutations)
- CORS-compliant requests

## Testing Strategy

### Unit Tests (80% coverage)
- Components render correctly
- Hooks manage state properly
- Utils return expected values

### Integration Tests
- Context providers work together
- RouterLocale Storage persistence
- Multi-component interactions

### Type Tests
- Branded types enforce safety
- Props match interfaces
- No TypeScript errors

## Scalability Considerations

### Adding New Features
1. Create feature folder
2. Define types
3. Create hooks for logic
4. Build components
5. Add tests
6. Update routing

### Code Organization Growth
- Keep features independent
- Share only through `shared/`
- Use TypeScript for safety
- Test everything

## Technology Decisions

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Virtual DOM performance

### Why Apollo Client?
- Best GraphQL client for React
- Automatic caching
- Type generation
- DevTools support

### Why TypeScript?
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Safer refactoring

### Why Vite?
- Fast HMR
- Modern ESM support
- Great DX
- Optimized builds

### Why TailwindCSS?
- Utility-first approach
- Consistent design system
- No CSS bloat
- Fast development

## Future Enhancements

### Potential Additions
- Server-side rendering (Next.js)
- Real-time updates (GraphQL subscriptions)
- User authentication
- Backend API for comments
- Advanced analytics
- Infinite scroll
- Enhanced PWA features

---

**Last Updated:** 2026-02-06  
**Version:** 1.0.0
