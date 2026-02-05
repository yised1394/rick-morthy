/**
 * Branded type for Character IDs to prevent mixing with other ID types.
 */
export type CharacterId = string & { readonly __brand: 'CharacterId' };

/**
 * Branded type for Comment IDs.
 */
export type CommentId = string & { readonly __brand: 'CommentId' };

/**
 * Branded type for Episode IDs.
 */
export type EpisodeId = string & { readonly __brand: 'EpisodeId' };

/**
 * Helper to create a CharacterId from a string.
 */
export function createCharacterId(id: string): CharacterId {
  return id as CharacterId;
}

/**
 * Helper to create a CommentId from a string.
 */
export function createCommentId(id: string): CommentId {
  return id as CommentId;
}

/**
 * Helper to create an EpisodeId from a string.
 */
export function createEpisodeId(id: string): EpisodeId {
  return id as EpisodeId;
}

/**
 * Pagination info from GraphQL API.
 */
export interface PaginationInfo {
  readonly count: number;
  readonly pages: number;
  readonly next: number | null;
  readonly prev: number | null;
}

/**
 * Base response wrapper for paginated queries.
 */
export interface PaginatedResponse<T> {
  readonly info: PaginationInfo;
  readonly results: readonly T[];
}
