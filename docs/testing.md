# Testing Guide

## Overview

The Rick and Morty Character Explorer includes a comprehensive test suite with **56 tests** covering components, hooks, utilities, and integration scenarios.

## Test Stack

- **Vitest** - Fast unit test framework
- **Testing Library** - React component testing
- **Happy DOM** - Lightweight DOM implementation
- **User Event** - Simulate user interactions

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage

# Run specific test file
npm run test character-card

# Run tests matching pattern
npm run test favorites
```

### Watch Mode Commands

When in watch mode, press:
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by file name pattern
- `t` - Filter by test name pattern
- `q` - Quit watch mode

## Test Structure

### Directory Organization

```
src/test/
├── features/                    # Feature-specific tests
│   ├── characters/
│   │   ├── character-card.test.tsx
│   │   └── character.utils.test.ts
│   ├── comments/
│   │   └── use-comments.test.tsx
│   ├── favorites/
│   │   └── use-favorites.test.tsx
│   └── soft-delete/
│       └── use-soft-delete.test.tsx
├── integration/                 # Integration tests
│   └── favorite-button.integration.test.tsx
├── shared/                      # Shared component tests
│   └── components/
│       └── badge.test.tsx
└── core/                        # Core functionality tests
    └── types/
        └── global.types.test.ts
```

## Test Categories

### 1. Component Tests (15 tests)

Test React component rendering and behavior.

**Example: CharacterCard**
```typescript
describe('CharacterCard', () => {
  it('renders character name', () => {
    render(
      <BrowserRouter>
        <FavoritesProvider>
          <CharacterCard character={mockCharacter} />
        </FavoritesProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
});
```

**Covered Components:**
- CharacterCard
- Badge
- (Other UI components)

### 2. Hook Tests (19 tests)

Test custom React hooks logic.

**Example: useFavorites**
```typescript
describe('useFavoritesContext', () => {
  it('toggles favorite on', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleFavorite(testId);
    });

    expect(result.current.isFavorite(testId)).toBe(true);
  });
});
```

**Covered Hooks:**
- useFavorites
- useComments
- useSoftDeleteCharacters

### 3. Utility Tests (13 tests)

Test pure functions and helpers.

**Example: Character Utils**
```typescript
describe('sortCharactersByName', () => {
  it('sorts ascending (A-Z)', () => {
    const result = sortCharactersByName(characters, 'asc');
    expect(result[0].name).toBe('Alice');
    expect(result[2].name).toBe('Charlie');
  });
});
```

**Covered Utils:**
- sortCharactersByName
- filterDeletedCharacters
- getStatusVariant

### 4. Integration Tests (9 tests)

Test multiple components working together.

**Example: FavoriteButton Integration**
```typescript
it('persists state across remounts', () => {
  const { unmount, rerender } = render(<TestComponent />);
  
  fireEvent.click(screen.getByRole('button'));
  unmount();
  rerender(<TestComponent />);
  
  expect(screen.getByLabelText(/remove/i)).toBeInTheDocument();
});
```

## Test Patterns

### AAA Pattern (Arrange-Act-Assert)

All tests follow this structure:

```typescript
it('should do something', () => {
  // Arrange - Set up test data
  const mockData = { ... };
  
  // Act - Perform the action
  const result = functionUnderTest(mockData);
  
  // Assert - Verify the result
  expect(result).toBe(expected);
});
```

### Test Isolation

Each test is independent:

```typescript
beforeEach(() => {
  localStorage.clear();  // Clean state
  vi.clearAllMocks();    // Reset mocks
});
```

### Descriptive Names

Test names clearly describe what they test:

```typescript
// ✅ Good
it('saves favorites to localStorage when toggled')
it('displays error message when API fails')

// ❌ Bad
it('works')
it('test 1')
```

## Common Test Scenarios

### 1. Testing Components with Providers

When testing components that use context:

```typescript
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <FavoritesProvider>
        <CommentsProvider>
          {ui}
        </CommentsProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

// Usage
renderWithProviders(<YourComponent />);
```

### 2. Testing Hooks

Use `renderHook` from Testing Library:

```typescript
const { result } = renderHook(() => useYourHook(), {
  wrapper: YourProvider,
});

// Access hook value
expect(result.current.someValue).toBe(expected);

// Call hook function
act(() => {
  result.current.someFunction();
});
```

### 3. Testing User Interactions

```typescript
import { fireEvent, screen } from '@testing-library/react';

// Click
fireEvent.click(screen.getByRole('button'));

// Type
fireEvent.change(screen.getByRole('textbox'), {
  target: { value: 'Rick' }
});

// Submit
fireEvent.submit(screen.getByRole('form'));
```

### 4. Testing LocalStorage

```typescript
beforeEach(() => {
  localStorage.clear();
});

it('saves data to localStorage', () => {
  // Your test...
  
  const stored = localStorage.getItem('key');
  expect(stored).toBeTruthy();
  expect(JSON.parse(stored)).toEqual(expected);
});
```

### 5. Testing Async Behavior

```typescript
it('loads data asynchronously', async () => {
  render(<AsyncComponent />);
  
  // Wait for element to appear
  const element = await screen.findByText('Loaded');
  expect(element).toBeInTheDocument();
});
```

## Test Coverage

### Current Coverage (100% Pass Rate)

| Category | Tests | Passing |
|----------|-------|---------|
| Components | 15 | ✅ 15/15 |
| Hooks | 19 | ✅ 19/19 |
| Utils | 13 | ✅ 13/13 |
| Integration | 9 | ✅ 9/9 |
| **Total** | **56** | **✅ 56/56** |

### Coverage Goals

- **Critical paths:** 100%
- **Components:** 90%+
- **Hooks:** 95%+
- **Utils:** 100%
- **Integration:** Key flows covered

## Mocking Strategies

### Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('@/some/module', () => ({
  someFunction: vi.fn(() => 'mocked value'),
}));
```

### Mocking LocalStorage

Already available in test environment:

```typescript
localStorage.setItem('key', 'value');
localStorage.getItem('key'); // 'value'
localStorage.clear();
```

### Mocking Apollo Client

```typescript
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: YOUR_QUERY,
      variables: { id: '1' },
    },
    result: {
      data: { ... },
    },
  },
];

<MockedProvider mocks={mocks}>
  <YourComponent />
</MockedProvider>
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - Tests what user sees
expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();

// ❌ Bad - Tests implementation details
expect(component.state.name).toBe('Rick Sanchez');
```

### 2. Use Semantic Queries

```typescript
// ✅ Preferred order
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// ❌ Avoid when possible
screen.getByTestId('submit-button')
screen.getByClassName('btn-primary')
```

### 3. Keep Tests Simple

Each test should test ONE thing:

```typescript
// ✅ Good - Single responsibility
it('renders character name', () => { ... });
it('renders character image', () => { ... });

// ❌ Bad - Tests multiple things
it('renders all character data', () => { ... });
```

### 4. Avoid Testing Third-Party Code

```typescript
// ✅ Good - Test your code
it('calls API with correct parameters', () => {
  const result = buildQueryVariables(filters);
  expect(result).toEqual(expected);
});

// ❌ Bad - Tests Apollo Client
it('Apollo Client caches responses', () => { ... });
```

## Debugging Tests

### 1. View Rendered Output

```typescript
import { screen } from '@testing-library/react';

// Print rendered HTML
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

### 2. Check Available Roles

```typescript
import { logRoles } from '@testing-library/react';

const { container } = render(<Component />);
logRoles(container);
```

### 3. Verbose Error Messages

When a query fails, Testing Library shows helpful suggestions:

```
Unable to find role="button"

Here are the accessible roles:
  heading:
  Name "Rick Sanchez"
  <h2 />
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:run
      - run: npm run type-check
```

## Performance

### Fast Tests

- Average test: <50ms
- Total suite: <2s
- Parallelization: Enabled by default

### Optimization Tips

1. **Use `happy-dom`** instead of `jsdom` (faster)
2. **Lazy render providers** - Only when needed
3. **Minimal setup** - Don't render full app for unit tests
4. **Mock heavy dependencies** - Apollo, Router

## Adding New Tests

### 1. Create Test File

Match the source file structure:

```
src/features/foo/bar.tsx
src/test/features/foo/bar.test.tsx
```

### 2. Write Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bar } from '@/features/foo/bar';

describe('Bar', () => {
  it('renders correctly', () => {
    render(<Bar />);
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });
});
```

### 3. Run Test

```bash
npm run test bar
```

## Resources

- **Vitest Docs:** https://vitest.dev/
- **Testing Library:** https://testing-library.com/react
- **Testing Best Practices:** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

**Last Updated:** 2026-02-06  
**Tests:** 56 passing
