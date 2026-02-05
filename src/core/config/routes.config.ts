/**
 * Application route definitions.
 * Using string literals for type safety and autocomplete.
 */
export const ROUTES = {
  HOME: '/',
  CHARACTERS: '/characters',
  CHARACTER_DETAIL: '/characters/:id',
  FAVORITES: '/favorites',
  DELETED: '/deleted',
  NOT_FOUND: '*',
} as const satisfies Record<string, string>;

/**
 * Helper to generate character detail route.
 *
 * @param id - Character ID
 * @returns Full route path for character detail page
 */
export function getCharacterDetailRoute(id: string): string {
  return `/characters/${id}`;
}
