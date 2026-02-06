# Desarrollador Frontend Senior - Guías de Generación de Código

## Contexto: Evaluación Técnica Rick and Morty

**Tipo de Proyecto**: Aplicación frontend con React 18 + TypeScript + GraphQL

**Requisitos Principales**:
- Listado de personajes en tarjetas (nombre, imagen, especie)
- Vista de detalle de personaje con enrutamiento (/characters/:id)
- Ordenamiento por nombre (A-Z / Z-A)
- Sistema de favoritos
- Sistema de comentarios
- UI responsive con Tailwind CSS
- Integración GraphQL (Apollo Client)
- Opcional: soft-delete, filtros (estado/especie/género), tests unitarios

---

## 🚨 REGLA CRÍTICA DE IDIOMA (OBLIGATORIA)

**TODO el código DEBE escribirse en INGLÉS**:
- Nombres de archivos
- Componentes
- Variables y funciones
- Tipos e interfaces
- Comentarios y JSDoc
- README y documentación técnica

**SOLO las explicaciones conceptuales y guías de diseño pueden estar en español**

---

## 📦 Stack Tecnológico y Versiones (2025)

### Versiones Estables Recomendadas:

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.26.2",
    "@apollo/client": "3.11.8",
    "graphql": "16.9.0",
    "tailwindcss": "4.0.0",
    "typescript": "5.6.3"
  },
  "devDependencies": {
    "@types/react": "18.3.12",
    "@types/react-dom": "18.3.1",
    "vite": "5.4.11",
    "@vitejs/plugin-react": "4.3.3",
    "postcss": "8.4.49",
    "@tailwindcss/postcss": "4.0.0"
  }
}
```

**IMPORTANTE**: NUNCA usar ^ ni ~ en las versiones. Siempre versiones fijas para reproducibilidad total.

---

## 1️⃣ React 18.3+ - Características Modernas

### Cambios Clave en React 18:

**Concurrent Features (Estables)**:
- `useTransition` - Para transiciones no bloqueantes
- `useDeferredValue` - Para diferir actualizaciones costosas
- `Suspense` - Ahora completamente estable para data fetching
- Automatic Batching - Agrupa actualizaciones de estado automáticamente

### Mejores Prácticas React 18:

```typescript
// ✅ BIEN: Usar useTransition para búsquedas
import { useTransition, useState } from 'react';

function SearchCharacters() {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <LoadingSpinner />}
    </div>
  );
}
```

```typescript
// ✅ BIEN: Usar useDeferredValue para listas grandes
import { useDeferredValue, useMemo } from 'react';

function CharacterList({ characters, searchTerm }: Props) {
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => 
      char.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [characters, deferredSearchTerm]);

  return (
    <ul>
      {filteredCharacters.map(char => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </ul>
  );
}
```

### Server Components (Experimental - NO USAR en esta prueba):
- Solo disponible en frameworks como Next.js
- Para esta prueba usar SOLO Client Components tradicionales

### Reglas Estrictas:
- **SOLO componentes funcionales** (no class components)
- **Rules of Hooks** aplicadas rigurosamente
- **Un componente por archivo**
- **Props destructuring** al inicio
- **Early returns** para renderizado condicional

---

## 2️⃣ TypeScript 5.6+ - Configuración Estricta

### Nuevas Features de TS 5.x que Debemos Aprovechar:

**TS 5.6 incluye**:
- Mejor inferencia de tipos para `const`
- `satisfies` operator más robusto
- Decorator support mejorado
- Error messages más claros

### tsconfig.json Obligatorio:

```json
{
  "compilerOptions": {
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    
    // Module Resolution
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    
    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": true,
    
    // JavaScript Support
    "allowJs": false,
    "checkJs": false,
    
    // Interop Constraints
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    
    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    
    // Type Checking
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### Reglas TypeScript:

**CERO tolerancia a `any`**:
```typescript
// ❌ MAL
function processData(data: any) {
  return data.map(item => item.name);
}

// ✅ BIEN - Con Generic + Constraint
function processData<T extends { name: string }>(data: T[]): string[] {
  return data.map(item => item.name);
}

// ✅ BIEN - Con Unknown + Type Guard
function processData(data: unknown): string[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array');
  }
  
  return data
    .filter((item): item is { name: string } => 
      typeof item === 'object' && 
      item !== null && 
      'name' in item
    )
    .map(item => item.name);
}
```

**Usar Branded Types para IDs**:
```typescript
// Previene mezclar diferentes tipos de IDs
type CharacterId = string & { readonly __brand: 'CharacterId' };
type CommentId = string & { readonly __brand: 'CommentId' };
type EpisodeId = string & { readonly __brand: 'EpisodeId' };

// Helper para crear IDs
function createCharacterId(id: string): CharacterId {
  return id as CharacterId;
}

// Ahora el compilador previene errores
function getCharacter(id: CharacterId): Character { /* ... */ }
function getComment(id: CommentId): Comment { /* ... */ }

// ❌ Error de compilación - tipos incompatibles
const charId = createCharacterId('1');
getComment(charId); // Type error!
```

**Usar `satisfies` para Type Safety + Inference**:
```typescript
// ✅ BIEN: Mantiene type safety Y autocomplete
const ROUTES = {
  HOME: '/',
  CHARACTERS: '/characters',
  CHARACTER_DETAIL: '/characters/:id',
  FAVORITES: '/favorites',
} as const satisfies Record<string, string>;

// Ahora TypeScript sabe que ROUTES.HOME es '/' (literal type)
// Y además valida que sea un Record<string, string>
```

---

## 3️⃣ Tailwind CSS v4 - Revolución CSS-First

### ⚠️ CAMBIOS CRÍTICOS EN TAILWIND V4:

Tailwind v4 cambió **radicalmente** su filosofía:

#### 1. **NO más tailwind.config.js**
```javascript
// ❌ ESTO YA NO SE USA EN V4
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#5b21b6'
      }
    }
  }
}
```

#### 2. **Configuración CSS-First con @theme**

Tu archivo principal de estilos (ej: `src/styles/tailwind.css`):

```css
@import "tailwindcss";

/* Define tu design system completo aquí */
@theme {
  /* Colores usando OKLCH (mejor que HEX) */
  --color-brand: oklch(0.55 0.25 275);
  --color-brand-light: oklch(0.75 0.20 275);
  --color-brand-dark: oklch(0.35 0.30 275);
  
  --color-accent: oklch(0.70 0.20 140);
  --color-danger: oklch(0.60 0.25 25);
  --color-success: oklch(0.65 0.20 145);
  
  /* Colores semánticos para la UI */
  --color-background: oklch(0.98 0.01 275);
  --color-foreground: oklch(0.15 0.02 275);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.15 0.02 275);
  
  /* Tipografías */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  
  /* Espaciado custom (si necesitas más allá del default) */
  --spacing-card: 1.25rem;
  --spacing-section: 3rem;
  
  /* Radios */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode variants */
@theme dark {
  --color-background: oklch(0.12 0.02 275);
  --color-foreground: oklch(0.95 0.01 275);
  --color-card: oklch(0.15 0.02 275);
  --color-card-foreground: oklch(0.95 0.01 275);
}
```

#### 3. **Configuración de PostCSS**

`postcss.config.js` (en la raíz):

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

#### 4. **NO más @tailwind directives separadas**

```css
/* ❌ V3 - Ya NO usar */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ V4 - Usar esto */
@import "tailwindcss";
```

#### 5. **Capas con @layer**

Crear componentes reutilizables:

```css
@layer components {
  /* Card component base */
  .card {
    @apply rounded-[var(--radius-lg)] bg-card p-6 shadow-md;
  }
  
  .card-header {
    @apply mb-4 border-b border-neutral-200 pb-4;
  }
  
  .card-title {
    @apply text-xl font-semibold text-card-foreground;
  }
  
  .card-body {
    @apply text-sm text-neutral-700;
  }
  
  /* Button variants */
  .btn {
    @apply inline-flex items-center justify-center rounded-[var(--radius-md)] 
           px-4 py-2 text-sm font-medium transition-colors
           focus-visible:outline-none focus-visible:ring-2 
           focus-visible:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-brand text-white hover:bg-brand-dark 
           focus-visible:ring-brand;
  }
  
  .btn-secondary {
    @apply bg-neutral-200 text-neutral-900 hover:bg-neutral-300
           focus-visible:ring-neutral-400;
  }
}
```

### Mejores Prácticas Tailwind V4:

#### **1. Tailwind ES tu preprocesador - NO uses Sass/Less/Stylus**

Tailwind v4 está diseñado para ser tu única herramienta de estilos. NO lo combines con otros preprocesadores.

#### **2. Design System First**

Antes de escribir un solo componente:

1. Define tu paleta de colores en `@theme`
2. Define tipografías
3. Define espaciados custom si los necesitas
4. Define radios y sombras
5. Crea tus componentes base en `@layer components`

#### **3. Organización de Classes (ESTRICTA)**

```typescript
// ✅ BIEN: Orden lógico y legible
<div className="
  /* Layout */
  flex flex-col md:flex-row
  
  /* Alignment */
  items-start md:items-center justify-between
  
  /* Spacing */
  gap-4 p-6
  
  /* Sizing */
  w-full max-w-4xl
  
  /* Visual */
  rounded-[var(--radius-lg)] bg-card
  
  /* Typography */
  text-sm text-card-foreground
  
  /* Effects */
  shadow-md
  
  /* States */
  hover:shadow-lg transition-shadow
  
  /* Responsive */
  md:p-8 lg:max-w-6xl
">
  {children}
</div>

// ❌ MAL: Clases desordenadas
<div className="bg-card hover:shadow-lg p-6 text-sm flex gap-4 md:p-8 rounded-[var(--radius-lg)] w-full items-start shadow-md">
  {children}
</div>
```

#### **4. Componentes React para Patrones Repetidos**

```typescript
// src/shared/components/ui/button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable button component with consistent styling.
 * Uses Tailwind v4 design tokens for theming.
 */
export function Button(props: ButtonProps) {
  const { 
    children, 
    variant = 'primary', 
    size = 'md',
    className = '', 
    ...rest 
  } = props;

  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'hover:bg-neutral-100',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      {...rest}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
```

#### **5. Utilities Arbitrarias con Moderación**

```typescript
// ✅ BIEN: Usar para casos específicos
<div className="grid grid-cols-[200px_1fr] gap-[1.15rem]">

// ❌ MAL: Abusar de valores arbitrarios
<div className="p-[13px] text-[15.5px] leading-[1.42857]">
```

**Regla**: Si usas el mismo valor arbitrario 3+ veces → agrégalo al `@theme`.

#### **6. Dark Mode con Variants Modernas**

```css
/* En tu CSS */
@variant dark (&:is(.dark *));
```

```typescript
// En tus componentes
<div className="bg-background text-foreground">
  {/* Los colores cambiarán automáticamente con dark mode */}
</div>

// O específicamente:
<div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
  {/* Control explícito */}
</div>
```

#### **7. Responsive Mobile-First**

```typescript
// ✅ BIEN: Empezar con mobile
<div className="
  flex flex-col gap-2 p-4
  sm:flex-row sm:gap-4 sm:p-6
  md:gap-6 md:p-8
  lg:max-w-6xl lg:mx-auto
">
```

#### **8. Accesibilidad con Tailwind**

```typescript
// Mínimo touch target 44x44px
<button className="min-w-[44px] min-h-[44px]">

// Focus visible siempre
<a className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">

// Contraste suficiente (usar herramientas como contrast checker)
<p className="text-neutral-700 dark:text-neutral-300">
```

---

## 4️⃣ React Router DOM v6.26+

### Cambios Importantes en v6:

**Ya NO existe**:
- `<Switch>` → Ahora es `<Routes>`
- `useHistory()` → Ahora es `useNavigate()`
- Prop `component` → Ahora es `element`

### Configuración Moderna:

```typescript
// src/core/config/routes.config.ts

/**
 * Application route definitions.
 * Using string literals for type safety and autocomplete.
 */
export const ROUTES = {
  HOME: '/',
  CHARACTERS: '/characters',
  CHARACTER_DETAIL: '/characters/:id',
  FAVORITES: '/favorites',
  NOT_FOUND: '*',
} as const;

/**
 * Helper to generate character detail route.
 */
export function getCharacterDetailRoute(id: string): string {
  return `/characters/${id}`;
}
```

```typescript
// src/core/config/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from './routes.config';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/home-page'));
const CharactersPage = lazy(() => import('@/pages/characters-page'));
const CharacterDetailPage = lazy(() => import('@/pages/character-detail-page'));
const FavoritesPage = lazy(() => import('@/pages/favorites-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="loader" aria-label="Loading..." />
        <p className="mt-4 text-sm text-neutral-600">Loading page...</p>
      </div>
    </div>
  );
}

/**
 * Application router configuration.
 * Uses React Router v6 with lazy loading for optimal performance.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CHARACTERS,
    element: (
      <Suspense fallback={<PageLoader />}>
        <CharactersPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CHARACTER_DETAIL,
    element: (
      <Suspense fallback={<PageLoader />}>
        <CharacterDetailPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.FAVORITES,
    element: (
      <Suspense fallback={<PageLoader />}>
        <FavoritesPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

// En App.tsx
export function App() {
  return <RouterProvider router={router} />;
}
```

### Navegación Programática:

```typescript
import { useNavigate } from 'react-router-dom';
import { getCharacterDetailRoute } from '@/core/config/routes.config';

function CharacterCard({ character }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getCharacterDetailRoute(character.id));
  };

  return (
    <article onClick={handleClick}>
      {/* ... */}
    </article>
  );
}
```

### Hooks Útiles:

```typescript
// Obtener parámetros de URL
const { id } = useParams<{ id: string }>();

// Obtener query params
const [searchParams, setSearchParams] = useSearchParams();
const page = searchParams.get('page') ?? '1';
const filter = searchParams.get('filter') ?? '';

// Cambiar query params (mantiene historial)
setSearchParams({ page: '2', filter: 'alive' });

// Obtener location actual
const location = useLocation();

// Navegar
const navigate = useNavigate();
navigate('/characters', { replace: true }); // Sin historial
```

---

## 5️⃣ Apollo Client v3.11+ con GraphQL

### Configuración Moderna de Apollo Client:

```typescript
// src/core/config/apollo.config.ts
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  from,
  ApolloLink,
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
 * Logs GraphQL and network errors.
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
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
          // Cache by filter parameters
          keyArgs: ['filter'],
          
          // Merge pagination results
          merge(existing, incoming, { args }) {
            if (!existing) return incoming;
            
            // If page changed, replace results
            if (args?.page !== existing.info?.prev) {
              return incoming;
            }
            
            // Otherwise, merge results (for infinite scroll)
            return {
              ...incoming,
              results: [...existing.results, ...incoming.results],
            };
          },
        },
      },
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
```

### Organización de Queries y Mutations:

```typescript
// src/features/characters/services/character.queries.ts
import { gql } from '@apollo/client';

/**
 * Fragment for character basic information.
 * Used across multiple queries for consistency.
 */
export const CHARACTER_BASIC_FRAGMENT = gql`
  fragment CharacterBasic on Character {
    id
    name
    image
    species
    status
    gender
  }
`;

/**
 * Query to fetch paginated characters with optional filtering.
 */
export const GET_CHARACTERS = gql`
  ${CHARACTER_BASIC_FRAGMENT}
  
  query GetCharacters($page: Int!, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        ...CharacterBasic
      }
    }
  }
`;

/**
 * Query to fetch a single character by ID with full details.
 */
export const GET_CHARACTER_BY_ID = gql`
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
        dimension
      }
      location {
        name
        dimension
      }
      image
      episode {
        id
        name
        episode
      }
      created
    }
  }
`;
```

### Hook Personalizado con GraphQL:

```typescript
// src/features/characters/hooks/use-characters.ts
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../services/character.queries';
import type { 
  GetCharactersQuery, 
  GetCharactersQueryVariables 
} from '../types/character.types';

export interface UseCharactersOptions {
  readonly page: number;
  readonly filter?: {
    readonly name?: string;
    readonly status?: string;
    readonly species?: string;
    readonly gender?: string;
  };
}

/**
 * Custom hook to fetch paginated characters with optional filtering.
 * 
 * @param options - Query options including page number and filters
 * @returns Query result with characters data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useCharacters({
 *   page: 1,
 *   filter: { status: 'alive' }
 * });
 * ```
 */
export function useCharacters(options: UseCharactersOptions) {
  const { page, filter } = options;

  return useQuery<GetCharactersQuery, GetCharactersQueryVariables>(
    GET_CHARACTERS,
    {
      variables: {
        page,
        filter: filter ?? {},
      },
      notifyOnNetworkStatusChange: true,
    }
  );
}
```

### Manejo de Estados (Loading, Error, Empty):

```typescript
// src/features/characters/components/character-list.tsx
import { useCharacters } from '../hooks/use-characters';
import { CharacterCard } from './character-card';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { ErrorMessage } from '@/shared/components/ui/error-message';
import { EmptyState } from '@/shared/components/ui/empty-state';

export function CharacterList() {
  const { data, loading, error, refetch } = useCharacters({ page: 1 });

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Failed to load characters"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  // Empty state
  if (!data?.characters.results || data.characters.results.length === 0) {
    return (
      <EmptyState
        title="No characters found"
        description="Try adjusting your filters or search criteria"
      />
    );
  }

  // Success state
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.characters.results.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
```

### Optimistic UI para Favoritos:

```typescript
// src/features/favorites/hooks/use-toggle-favorite.ts
import { useMutation } from '@apollo/client';
import { TOGGLE_FAVORITE } from '../services/favorite.mutations';

/**
 * Hook to toggle favorite status with optimistic UI.
 * Updates UI immediately while request is in progress.
 */
export function useToggleFavorite() {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    optimisticResponse: (variables) => ({
      toggleFavorite: {
        __typename: 'Character',
        id: variables.characterId,
        isFavorite: variables.isFavorite,
      },
    }),
    update(cache, { data }) {
      // Update cache manually if needed
      cache.modify({
        id: cache.identify({ __typename: 'Character', id: data?.toggleFavorite.id }),
        fields: {
          isFavorite() {
            return data?.toggleFavorite.isFavorite;
          },
        },
      });
    },
  });

  return { toggleFavorite };
}
```

---

## 6️⃣ Progressive Web App (PWA) - Mejores Prácticas

### ⚡ Por Qué PWA es Crítico para Esta Prueba:

Una PWA bien implementada demuestra:
- Conocimiento de web APIs modernas
- Enfoque en UX y performance
- Capacidad de trabajar offline
- Pensamiento mobile-first

### Dependencias Necesarias:

```json
{
  "devDependencies": {
    "vite-plugin-pwa": "0.20.5",
    "workbox-window": "7.1.0"
  }
}
```

### 1. Configuración de Vite PWA Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      manifest: {
        name: 'Rick and Morty Character Explorer',
        short_name: 'R&M Explorer',
        description: 'Explore characters from Rick and Morty series',
        theme_color: '#5b21b6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        
        categories: ['entertainment', 'education'],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        
        runtimeCaching: [
          {
            // Cache GraphQL API responses
            urlPattern: ({ url }) => url.origin === 'https://rickandmortyapi.com',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rickandmorty-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache character images
            urlPattern: ({ url }) => url.pathname.includes('/avatar/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'character-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        
        // Clean up old caches
        cleanupOutdatedCaches: true,
        
        // Skip waiting to activate new service worker immediately
        skipWaiting: true,
        clientsClaim: true,
      },
      
      devOptions: {
        enabled: true, // Enable in dev for testing
        type: 'module',
      },
    }),
  ],
});
```

### 2. Service Worker Registration con Update Prompt

```typescript
// src/core/config/pwa.config.ts
import { registerSW } from 'virtual:pwa-register';

/**
 * Register service worker with update prompt.
 * Shows notification when new version is available.
 */
export function registerServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      // Show update notification to user
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
      
      // Optional: Show notification that app is ready offline
      showNotification('App is ready for offline use', 'success');
    },
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
      
      // Check for updates every hour
      setInterval(() => {
        registration?.update();
      }, 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });
}

/**
 * Helper to show user notifications.
 */
function showNotification(message: string, type: 'success' | 'info' | 'error') {
  // Implement your notification UI here
  console.log(`[${type.toUpperCase()}] ${message}`);
}
```

### 3. Update Notification Component

```typescript
// src/shared/components/pwa/pwa-update-prompt.tsx
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Component that shows update prompt when new version is available.
 * Uses a toast-like notification for better UX.
 */
export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW registered:', registration);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      role="alert"
      className="
        fixed bottom-4 right-4 z-50
        max-w-md rounded-lg bg-card p-4 shadow-lg
        border border-neutral-200
        animate-slide-in
      "
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-card-foreground">
            Update Available
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            A new version of the app is available. Refresh to update.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpdate}
              className="btn btn-primary btn-sm"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="btn btn-secondary btn-sm"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
          aria-label="Dismiss"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
```

### 4. Offline Indicator Component

```typescript
// src/shared/components/pwa/offline-indicator.tsx
import { useEffect, useState } from 'react';

/**
 * Component that shows when app is offline.
 * Uses Network Information API when available.
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="
        fixed top-0 left-0 right-0 z-50
        bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-white
        shadow-md
      "
    >
      <div className="flex items-center justify-center gap-2">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
}
```

### 5. Install Prompt Component (Add to Home Screen)

```typescript
// src/shared/components/pwa/install-prompt.tsx
import { useEffect, useState } from 'react';

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
    const handler = (event: Event) => {
      // Prevent default browser install prompt
      event.preventDefault();
      
      // Save prompt for later
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      
      // Show custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    await deferredPrompt.prompt();

    // Wait for user choice
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted install prompt');
    }

    // Clear prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Remember dismissal (don't show again for 7 days)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = parseInt(dismissed, 10);
      const daysSinceDismissal = (Date.now() - dismissedDate) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissal < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

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
            <button
              onClick={handleInstall}
              className="btn btn-primary btn-sm flex-1"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="btn btn-secondary btn-sm"
            >
              Not Now
            </button>
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
```

### 6. Integración en App Principal

```typescript
// src/App.tsx
import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './core/config/apollo.config';
import { router } from './core/config/router';
import { PWAUpdatePrompt } from './shared/components/pwa/pwa-update-prompt';
import { OfflineIndicator } from './shared/components/pwa/offline-indicator';
import { InstallPrompt } from './shared/components/pwa/install-prompt';
import { ErrorBoundary } from './shared/components/error-boundary';

/**
 * Root application component.
 * Wraps app with providers and PWA components.
 */
export function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} />
        
        {/* PWA Components */}
        <PWAUpdatePrompt />
        <OfflineIndicator />
        <InstallPrompt />
      </ApolloProvider>
    </ErrorBoundary>
  );
}
```

### 7. Hook Personalizado para Detectar Modo PWA

```typescript
// src/shared/hooks/use-pwa-display-mode.ts
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
    // Check display mode on mount
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
      handlers.forEach(cleanup => cleanup());
    };
  }, []);

  return displayMode;
}
```

### 8. Cache Management Utilities

```typescript
// src/shared/utils/cache.utils.ts

/**
 * Clear all app caches (useful for logout or data reset).
 */
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  }
}

/**
 * Get total cache size (approximation).
 */
export async function getCacheSize(): Promise<number> {
  if ('caches' in window && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

/**
 * Check if cache quota is running low.
 */
export async function isCacheQuotaLow(): Promise<boolean> {
  if ('estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = (usage / quota) * 100;
    
    return percentage > 80; // 80% threshold
  }
  return false;
}

/**
 * Preload critical resources for offline use.
 */
export async function preloadCriticalResources(): Promise<void> {
  if ('caches' in window) {
    const cache = await caches.open('critical-resources');
    const criticalResources = [
      '/',
      '/characters',
      '/favorites',
    ];
    
    await cache.addAll(criticalResources);
    console.log('Critical resources preloaded');
  }
}
```

### 9. Mejores Prácticas PWA - Checklist

#### **Manifest (Web App Manifest)**:
- [ ] `name` y `short_name` descriptivos
- [ ] `description` clara y concisa
- [ ] `theme_color` consistente con diseño
- [ ] `background_color` para splash screen
- [ ] `display: standalone` para experiencia app-like
- [ ] Iconos múltiples tamaños (64x64, 192x192, 512x512)
- [ ] Icono maskable para Android
- [ ] Screenshots para app stores

#### **Service Worker**:
- [ ] Estrategia de cache apropiada por tipo de recurso
- [ ] Cache de API con expiración
- [ ] Cache de imágenes optimizado
- [ ] Fallback para páginas offline
- [ ] Skip waiting para updates inmediatos
- [ ] Cleanup de caches antiguos

#### **Performance**:
- [ ] Lazy loading de rutas
- [ ] Code splitting estratégico
- [ ] Preload de recursos críticos
- [ ] Optimización de imágenes (WebP)
- [ ] Compression (gzip/brotli)
- [ ] Bundle size < 200KB

#### **UX Offline**:
- [ ] Indicador de estado de conexión
- [ ] Mensaje cuando funcionalidad requiere conexión
- [ ] Cache de datos previamente visitados
- [ ] Queue de acciones offline (favoritos, comentarios)
- [ ] Sincronización cuando vuelve conexión

#### **Updates**:
- [ ] Notificación de actualización disponible
- [ ] Prompt amigable para actualizar
- [ ] Opción de postponer actualización
- [ ] Check de updates periódico (cada hora)

#### **Instalación**:
- [ ] Prompt de instalación customizado
- [ ] Detectar si ya está instalado
- [ ] No mostrar prompt si se rechazó recientemente
- [ ] Tracking de instalaciones

#### **SEO y Metadatos**:
- [ ] `meta` tags para social sharing
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Sitemap.xml

### 10. Testing PWA

```typescript
// src/test/pwa.test.ts
import { describe, it, expect } from 'vitest';

describe('PWA Configuration', () => {
  it('should have valid manifest.json', async () => {
    const response = await fetch('/manifest.json');
    const manifest = await response.json();
    
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.icons).toHaveLength.greaterThan(0);
    expect(manifest.display).toBe('standalone');
  });

  it('should register service worker', () => {
    expect('serviceWorker' in navigator).toBe(true);
  });

  it('should have cache API available', () => {
    expect('caches' in window).toBe(true);
  });
});
```

### 11. Estructura de Assets PWA

```
public/
├── favicon.ico
├── apple-touch-icon.png          # 180x180
├── pwa-64x64.png
├── pwa-192x192.png
├── pwa-512x512.png
├── maskable-icon-512x512.png     # Con safe zone
├── screenshot-wide.png           # 1280x720 (desktop)
├── screenshot-narrow.png         # 750x1334 (mobile)
└── manifest.json                 # Generado automáticamente
```

### 12. Generación de Iconos PWA

Usa herramientas como:
- **PWA Asset Generator**: https://github.com/elegantapp/pwa-asset-generator
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Maskable.app**: https://maskable.app/ (para iconos adaptables)

```bash
# Generar todos los iconos desde un SVG
npx pwa-asset-generator logo.svg public/ \
  --icon-only \
  --favicon \
  --maskable \
  --type png \
  --quality 100
```

### 13. HTML Meta Tags para PWA

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#5b21b6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="R&M Explorer" />
    
    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="64x64" href="/pwa-64x64.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="mask-icon" href="/mask-icon.svg" color="#5b21b6" />
    
    <title>Rick and Morty Character Explorer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 7️⃣ Arquitectura del Proyecto (FEATURE-BASED)

### Estructura de Directorios Completa:

```
rick-and-morty-app/
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── pwa-64x64.png
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── maskable-icon-512x512.png
│   ├── screenshot-wide.png
│   └── screenshot-narrow.png
├── src/
│   ├── core/                           # App initialization
│   │   ├── config/
│   │   │   ├── apollo.config.ts        # Apollo Client setup
│   │   │   ├── routes.config.ts        # Route definitions
│   │   │   ├── router.tsx              # Router configuration
│   │   │   └── pwa.config.ts           # PWA registration
│   │   ├── providers/
│   │   │   ├── app-providers.tsx       # All providers combined
│   │   │   ├── apollo-provider.tsx     # Apollo Provider
│   │   │   └── theme-provider.tsx      # Theme/Dark mode
│   │   └── types/
│   │       └── global.types.ts         # Global type definitions
│   │
│   ├── features/                       # Feature modules
│   │   ├── characters/
│   │   │   ├── components/
│   │   │   │   ├── character-card.tsx
│   │   │   │   ├── character-list.tsx
│   │   │   │   ├── character-filters.tsx
│   │   │   │   └── character-sort.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-characters.ts
│   │   │   │   ├── use-character-by-id.ts
│   │   │   │   └── use-character-filters.ts
│   │   │   ├── services/
│   │   │   │   └── character.queries.ts
│   │   │   ├── types/
│   │   │   │   └── character.types.ts
│   │   │   └── utils/
│   │   │       └── character.utils.ts
│   │   │
│   │   ├── favorites/
│   │   │   ├── components/
│   │   │   │   ├── favorite-button.tsx
│   │   │   │   └── favorites-list.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-favorites.ts
│   │   │   │   └── use-toggle-favorite.ts
│   │   │   ├── services/
│   │   │   │   └── favorites.storage.ts
│   │   │   └── types/
│   │   │       └── favorite.types.ts
│   │   │
│   │   └── comments/
│   │       ├── components/
│   │       │   ├── comment-form.tsx
│   │       │   ├── comment-list.tsx
│   │       │   └── comment-item.tsx
│   │       ├── hooks/
│   │       │   ├── use-comments.ts
│   │       │   └── use-add-comment.ts
│   │       ├── services/
│   │       │   └── comments.storage.ts
│   │       └── types/
│   │           └── comment.types.ts
│   │
│   ├── pages/                          # Route-level components
│   │   ├── home-page.tsx
│   │   ├── characters-page.tsx
│   │   ├── character-detail-page.tsx
│   │   ├── favorites-page.tsx
│   │   └── not-found-page.tsx
│   │
│   ├── shared/                         # Shared across features
│   │   ├── components/
│   │   │   ├── ui/                     # Basic UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── loading-spinner.tsx
│   │   │   │   ├── error-message.tsx
│   │   │   │   └── empty-state.tsx
│   │   │   ├── layout/                 # Layout components
│   │   │   │   ├── header.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── main-layout.tsx
│   │   │   └── pwa/                    # PWA components
│   │   │       ├── pwa-update-prompt.tsx
│   │   │       ├── offline-indicator.tsx
│   │   │       └── install-prompt.tsx
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-media-query.ts
│   │   │   └── use-pwa-display-mode.ts
│   │   ├── types/
│   │   │   └── common.types.ts
│   │   ├── utils/
│   │   │   ├── cn.utils.ts             # className utility
│   │   │   ├── format.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   └── cache.utils.ts          # PWA cache utilities
│   │   └── constants/
│   │       └── app.constants.ts
│   │
│   ├── styles/
│   │   └── tailwind.css                # Tailwind v4 config
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .gitignore
├── .eslintrc.cjs
├── index.html
├── package.json
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

### Reglas de Arquitectura:

1. **NO usar barrel files** (index.ts) - Imports explícitos siempre
2. **Límite de 300 líneas por archivo** - Si se excede, dividir
3. **Features independientes** - No importar de otras features
4. **Dirección de dependencias**: Features → Shared → Core (nunca al revés)
5. **Un componente por archivo**

---

## 8️⃣ Gestión de Estado

### Estrategia por Tipo de Estado:

| Tipo de Estado | Solución | Ejemplo |
|----------------|----------|---------|
| UI Local | `useState` | Toggles, modal abierto/cerrado |
| URL State | `useSearchParams` | Filtros, paginación, ordenamiento |
| Server State | Apollo Cache | Datos de API |
| Global App State | Context API | Tema, favoritos, usuario |
| Form State | `useState` + validación | Formularios de comentarios |

### Implementación de Favoritos (LocalStorage):

```typescript
// src/features/favorites/hooks/use-favorites.ts
import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'rickandmorty_favorites';

type CharacterId = string & { readonly __brand: 'CharacterId' };

/**
 * Hook to manage character favorites using localStorage.
 * Syncs across browser tabs automatically.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<CharacterId>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  // Sync with localStorage on change
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY && event.newValue) {
        try {
          setFavorites(new Set(JSON.parse(event.newValue)));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = useCallback((id: CharacterId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: CharacterId) => favorites.has(id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    count: favorites.size,
  };
}
```

### URL como Source of Truth para Filtros:

```typescript
// src/features/characters/hooks/use-character-filters.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export interface CharacterFilters {
  readonly page: number;
  readonly name?: string;
  readonly status?: string;
  readonly species?: string;
  readonly gender?: string;
  readonly sortBy?: 'name-asc' | 'name-desc';
}

/**
 * Hook to manage character filters via URL search params.
 * Keeps filters in URL for shareability and browser history.
 */
export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CharacterFilters = {
    page: Number(searchParams.get('page')) || 1,
    name: searchParams.get('name') || undefined,
    status: searchParams.get('status') || undefined,
    species: searchParams.get('species') || undefined,
    gender: searchParams.get('gender') || undefined,
    sortBy: (searchParams.get('sortBy') as CharacterFilters['sortBy']) || undefined,
  };

  const updateFilters = useCallback(
    (updates: Partial<CharacterFilters>) => {
      const newParams = new URLSearchParams(searchParams);

      // Reset to page 1 when filters change
      if (Object.keys(updates).some(key => key !== 'page')) {
        newParams.set('page', '1');
      }

      // Update each filter
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
```

---

## 9️⃣ Manejo de Errores y Resiliencia

### Error Boundary (Class Component - Única excepción):

```typescript
// src/shared/components/error-boundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * Error boundary to catch and handle rendering errors.
 * This is one of the few valid uses of class components.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-danger">
              Oops! Something went wrong
            </h1>
            <p className="mt-2 text-neutral-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary mt-6"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Componentes de UI para Estados:

```typescript
// src/shared/components/ui/error-message.tsx

export interface ErrorMessageProps {
  readonly title: string;
  readonly message: string;
  readonly onRetry?: () => void;
}

/**
 * Generic error message component with optional retry action.
 */
export function ErrorMessage(props: ErrorMessageProps) {
  const { title, message, onRetry } = props;

  return (
    <div 
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="text-danger mb-4">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-foreground">
        {title}
      </h2>
      
      <p className="mt-2 text-sm text-neutral-600">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary mt-6"
        >
          Try again
        </button>
      )}
    </div>
  );
}
```

---

## 1️⃣0️⃣ Testing Strategy

### Configuración con Vitest + Testing Library:

```json
// package.json
{
  "devDependencies": {
    "vitest": "2.1.5",
    "@testing-library/react": "16.0.1",
    "@testing-library/jest-dom": "6.6.3",
    "@testing-library/user-event": "14.5.2",
    "jsdom": "25.0.1"
  }
}
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
});
```

### Ejemplo de Test:

```typescript
// src/features/characters/components/character-card.test.tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CharacterCard } from './character-card';
import type { Character } from '../types/character.types';

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  species: 'Human',
  status: 'Alive',
  gender: 'Male',
};

describe('CharacterCard', () => {
  it('renders character information correctly', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByRole('heading', { name: /rick sanchez/i })).toBeInTheDocument();
    expect(screen.getByText(/human/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
      'src',
      mockCharacter.image
    );
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<CharacterCard character={mockCharacter} onClick={handleClick} />);
    
    await user.click(screen.getByRole('article'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows favorite indicator when character is favorited', () => {
    render(<CharacterCard character={mockCharacter} isFavorite />);
    
    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });
});
```

---

## 1️⃣1️⃣ Convenciones de Nombres (OBLIGATORIAS)

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | kebab-case | `character-card.tsx` |
| Componentes | PascalCase | `CharacterCard` |
| Hooks | camelCase + use | `useCharacters` |
| Funciones | camelCase | `fetchCharacterData` |
| Variables | camelCase | `characterList` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Tipos/Interfaces | PascalCase | `Character`, `ApiResponse` |
| Enums | PascalCase | `CharacterStatus` |
| GraphQL Operations | PascalCase + Suffix | `GetCharactersQuery` |
| CSS Classes (custom) | kebab-case | `character-card` |
| Test Files | source + .test | `character-card.test.tsx` |

---

## 1️⃣2️⃣ JSDoc (TODO EN INGLÉS)

```typescript
/**
 * Fetches a paginated list of characters from the Rick and Morty API.
 * 
 * Supports filtering by name, status, species, and gender.
 * Results are cached using Apollo Client's cache policy.
 *
 * @param options - Query configuration options
 * @param options.page - Page number to fetch (1-indexed)
 * @param options.filter - Optional filter criteria
 * @returns Apollo query result with characters data, loading state, and errors
 * 
 * @throws {ApolloError} When GraphQL query fails or network error occurs
 * 
 * @example
 * Basic usage:
 * ```tsx
 * const { data, loading } = useCharacters({ page: 1 });
 * ```
 * 
 * @example
 * With filters:
 * ```tsx
 * const { data } = useCharacters({
 *   page: 1,
 *   filter: { status: 'alive', species: 'human' }
 * });
 * ```
 */
export function useCharacters(options: UseCharactersOptions): UseCharactersResult {
  // Implementation
}
```

---

## 1️⃣3️⃣ Principios SOLID Aplicados

### Single Responsibility:
```typescript
// ✅ BIEN: Cada función una responsabilidad
function sortCharactersByName(characters: Character[], order: 'asc' | 'desc'): Character[] {
  return [...characters].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}

function filterCharactersByStatus(characters: Character[], status: string): Character[] {
  return characters.filter(char => char.status === status);
}

// ❌ MAL: Una función hace demasiado
function processCharacters(characters: Character[], options: any): Character[] {
  // Sorting, filtering, transforming all in one
}
```

### Open/Closed:
```typescript
// ✅ BIEN: Extensible sin modificar
interface CharacterFilter {
  apply(character: Character): boolean;
}

class StatusFilter implements CharacterFilter {
  constructor(private status: string) {}
  
  apply(character: Character): boolean {
    return character.status === this.status;
  }
}

class SpeciesFilter implements CharacterFilter {
  constructor(private species: string) {}
  
  apply(character: Character): boolean {
    return character.species === this.species;
  }
}
```

---

## 1️⃣4️⃣ Performance & Optimization

### Métricas Objetivo:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Bundle Size**: < 200KB (gzipped)

### Técnicas:

1. **Code Splitting con React.lazy**
2. **Image Optimization** (WebP, lazy loading)
3. **Memoización estratégica** (useMemo, useCallback, React.memo)
4. **Debounce en búsquedas** (300ms mínimo)
5. **Virtual scrolling** para listas > 100 items
6. **Preload de recursos críticos**

---

## 1️⃣5️⃣ Accesibilidad (WCAG 2.1 AA)

### Checklist Obligatorio:

- [ ] HTML semántico (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] Todos los inputs tienen `<label>` asociado
- [ ] Todas las imágenes tienen `alt` descriptivo
- [ ] Focus visible en todos los elementos interactivos
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (18px+)
- [ ] Navegación completa por teclado (Tab, Enter, Escape)
- [ ] ARIA labels donde sea necesario
- [ ] Touch targets mínimo 44x44px
- [ ] Sin `outline: none` sin reemplazo visual

### Ejemplo:

```typescript
<button
  onClick={handleToggleFavorite}
  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
  aria-pressed={isFavorite}
  className="btn btn-ghost min-h-[44px] min-w-[44px] focus-visible:ring-2"
>
  <HeartIcon 
    aria-hidden="true"
    className={isFavorite ? 'fill-danger' : ''}
  />
</button>
```

---

## 1️⃣6️⃣ Git Workflow (Conventional Commits)

### Formato:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, espacios (no afecta código)
- `refactor`: Refactorización sin cambio funcional
- `test`: Agregar o corregir tests
- `chore`: Mantenimiento, dependencias

### Ejemplos:

```bash
feat(characters): add sorting by name functionality
fix(favorites): persist favorites across page reloads
docs(readme): add installation instructions
refactor(apollo): improve cache configuration
test(character-card): add interaction tests
chore(deps): update dependencies to latest versions
```

### Branch Naming:

```
feat/character-detail-page
fix/favorite-button-state
refactor/apollo-client-setup
test/character-list-component
```

---

## 1️⃣7️⃣ Checklist de Calidad (PRE-COMMIT)

Antes de hacer commit, verificar:

- [ ] **TypeScript**: 0 errores, 0 warnings
- [ ] **ESLint**: 0 violaciones
- [ ] **Tests**: Todos pasan
- [ ] **JSDoc**: Todas las funciones/componentes exportados documentados
- [ ] **Console.logs**: Removidos del código de producción
- [ ] **Código comentado**: Removido
- [ ] **TODOs**: Resueltos o documentados en issues
- [ ] **Nombres**: Todos descriptivos y en inglés
- [ ] **Imports**: Organizados y sin duplicados
- [ ] **Responsiveness**: Testeado en mobile, tablet, desktop
- [ ] **Accesibilidad**: Navegación por teclado funciona
- [ ] **Performance**: Sin renders innecesarios
- [ ] **PWA**: Service worker registrado y funcionando
- [ ] **PWA**: Manifest configurado correctamente
- [ ] **PWA**: Iconos PWA generados (todos los tamaños)
- [ ] **PWA**: Estrategias de cache implementadas
- [ ] **PWA**: Indicador offline funciona
- [ ] **PWA**: Update prompt implementado

---

## 1️⃣8️⃣ README Requirements

Tu README debe incluir:

```markdown
# Rick and Morty Character Explorer

> Modern Progressive Web App to explore characters from Rick and Morty series

## Tech Stack

- React 18.3.1
- TypeScript 5.6.3
- React Router DOM 6.26.2
- Apollo Client 3.11.8
- Tailwind CSS 4.0.0
- Vite 5.4.11
- PWA (vite-plugin-pwa 0.20.5)

## Features

- 🔍 Search and filter characters
- ⭐ Mark favorites (synced across tabs)
- 💬 Add comments
- 📱 Fully responsive
- 📴 Works offline (PWA)
- 🔔 Update notifications
- 📲 Installable on any device
- ♿ Accessibility compliant (WCAG 2.1 AA)
- ⚡ Optimized performance (Lighthouse 95+)

## PWA Features

- ✅ Service Worker with intelligent caching
- ✅ Offline functionality
- ✅ Install prompt for desktop and mobile
- ✅ Push notifications for updates
- ✅ App-like experience when installed
- ✅ Fast load times with pre-caching

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

\`\`\`bash
# Clone repository
git clone [url]

# Install dependencies (exact versions, no caret)
npm install

# Start development server
npm run dev
\`\`\`

### Available Scripts

- `npm run dev` - Start development server (PWA enabled)
- `npm run build` - Build for production with PWA
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Architecture

This project follows a feature-based architecture with strict separation of concerns:

- **Core**: App initialization, routing, providers
- **Features**: Self-contained modules (characters, favorites, comments)
- **Shared**: Reusable components, hooks, utilities
- **PWA**: Progressive Web App components and utilities

## PWA Setup

The app is configured as a Progressive Web App with:

1. **Manifest**: Complete web app manifest with all required icons
2. **Service Worker**: Workbox-powered SW with smart caching strategies
3. **Offline Support**: API responses and images cached for offline use
4. **Update Strategy**: Automatic updates with user notification
5. **Install Prompt**: Custom UI for installation on mobile/desktop

### Cache Strategies

- **API Calls**: Network First (10s timeout, falls back to cache)
- **Images**: Cache First (100 entries, 30 days expiration)
- **Fonts**: Stale While Revalidate
- **Static Assets**: Pre-cached during install

## Project Structure

[Show detailed directory tree with PWA folder]

## Performance

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse PWA Score: 100

## Testing PWA

### Desktop
1. Open Chrome DevTools > Application
2. Check Manifest and Service Worker tabs
3. Test offline mode in Network tab

### Mobile
1. Open in Chrome Android/Safari iOS
2. Look for "Add to Home Screen" prompt
3. Install and test as standalone app

## Browser Support

- Chrome/Edge 111+
- Safari 16.4+
- Firefox 128+

## License

MIT
```

---
