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

/**
 * Query to fetch multiple characters by IDs.
 */
export const GET_CHARACTERS_BY_IDS = gql`
  ${CHARACTER_BASIC_FRAGMENT}

  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      ...CharacterBasic
    }
  }
`;
