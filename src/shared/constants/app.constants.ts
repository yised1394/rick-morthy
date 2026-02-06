/**
 * Application constants.
 */

/**
 * LocalStorage keys used by the application.
 */
export const STORAGE_KEYS = {
  FAVORITES: 'rickandmorty_favorites',
  COMMENTS: 'rickandmorty_comments',
  DELETED_CHARACTERS: 'rickandmorty_deleted',
  PWA_INSTALL_DISMISSED: 'pwa_install_dismissed',
} as const;

/**
 * Default pagination settings.
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  PAGE_SIZE: 20,
} as const;

/**
 * API configuration.
 */
export const API = {
  GRAPHQL_ENDPOINT: 'https://rickandmortyapi.com/graphql',
  IMAGE_BASE_URL: 'https://rickandmortyapi.com/api/character/avatar',
} as const;

/**
 * Character status options for filtering.
 */
export const CHARACTER_STATUS = ['Alive', 'Dead', 'unknown'] as const;

/**
 * Character gender options for filtering.
 */
export const CHARACTER_GENDER = ['Female', 'Male', 'Genderless', 'unknown'] as const;

/**
 * Sort order options.
 */
export const SORT_OPTIONS = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
