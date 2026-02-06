import { describe, it, expect } from 'vitest';
import { sortCharactersByName, filterDeletedCharacters } from '@/features/characters/utils/character.utils';
import type { CharacterBasic } from '@/features/characters/types/character.types';
import { createCharacterId } from '@/core/types/global.types';

const mockCharacters: CharacterBasic[] = [
  {
    id: createCharacterId('3'),
    name: 'Summer Smith',
    image: 'test.jpg',
    species: 'Human',
    status: 'Alive',
    gender: 'Female',
  },
  {
    id: createCharacterId('1'),
    name: 'Rick Sanchez',
    image: 'test.jpg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
  },
  {
    id: createCharacterId('2'),
    name: 'Morty Smith',
    image: 'test.jpg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
  },
];

describe('character.utils', () => {
  describe('sortCharactersByName', () => {
    it('sorts characters A-Z (ascending)', () => {
      const sorted = sortCharactersByName(mockCharacters, 'name-asc');
      
      expect(sorted[0]!.name).toBe('Morty Smith');
      expect(sorted[1]!.name).toBe('Rick Sanchez');
      expect(sorted[2]!.name).toBe('Summer Smith');
    });

    it('sorts characters Z-A (descending)', () => {
      const sorted = sortCharactersByName(mockCharacters, 'name-desc');
      
      expect(sorted[0]!.name).toBe('Summer Smith');
      expect(sorted[1]!.name).toBe('Rick Sanchez');
      expect(sorted[2]!.name).toBe('Morty Smith');
    });

    it('returns original array if sort option is invalid', () => {
      const sorted = sortCharactersByName(mockCharacters, '' as any);
      
      expect(sorted).toEqual(mockCharacters);
    });

    it('does not mutate original array', () => {
      const original = [...mockCharacters];
      sortCharactersByName(mockCharacters, 'name-asc');
      
      expect(mockCharacters).toEqual(original);
    });

    it('handles empty array', () => {
      const sorted = sortCharactersByName([], 'name-asc');
      
      expect(sorted).toEqual([]);
    });

    it('handles single character', () => {
      const single = [mockCharacters[0]!];
      const sorted = sortCharactersByName(single, 'name-asc');
      
      expect(sorted).toEqual(single);
    });
  });

  describe('filterDeletedCharacters', () => {
    it('filters out deleted characters', () => {
      const deletedIds = new Set([createCharacterId('1'), createCharacterId('3')]);
      const filtered = filterDeletedCharacters(mockCharacters, deletedIds);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0]!.id).toBe(createCharacterId('2'));
      expect(filtered[0]!.name).toBe('Morty Smith');
    });

    it('returns all characters if none are deleted', () => {
      const deletedIds = new Set<string>();
      const filtered = filterDeletedCharacters(mockCharacters, deletedIds);
      
      expect(filtered.length).toBe(3);
      expect(filtered).toEqual(mockCharacters);
    });

    it('returns empty array if all characters are deleted', () => {
      const deletedIds = new Set([
        createCharacterId('1'),
        createCharacterId('2'),
        createCharacterId('3'),
      ]);
      const filtered = filterDeletedCharacters(mockCharacters, deletedIds);
      
      expect(filtered.length).toBe(0);
    });

    it('handles empty character array', () => {
      const deletedIds = new Set([createCharacterId('1')]);
      const filtered = filterDeletedCharacters([], deletedIds);
      
      expect(filtered).toEqual([]);
    });

    it('does not mutate original array', () => {
      const original = [...mockCharacters];
      const deletedIds = new Set([createCharacterId('1')]);
      filterDeletedCharacters(mockCharacters, deletedIds);
      
      expect(mockCharacters).toEqual(original);
    });
  });
});
