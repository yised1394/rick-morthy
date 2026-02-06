import { describe, it, expect } from 'vitest';
import { createCharacterId, createEpisodeId } from '@/core/types/global.types';

describe('Brand Types', () => {
  describe('createCharacterId', () => {
    it('creates a branded CharacterId from string', () => {
      const id = createCharacterId('123');
      
      expect(id).toBe('123');
    });

    it('preserves the string value', () => {
      const id = createCharacterId('test-id');
      
      expect(typeof id).toBe('string');
      expect(id.toString()).toBe('test-id');
    });

    it('works with numeric strings', () => {
      const id = createCharacterId('42');
      
      expect(id).toBe('42');
    });
  });

  describe('createEpisodeId', () => {
    it('creates a branded EpisodeId from string', () => {
      const id = createEpisodeId('456');
      
      expect(id).toBe('456');
    });

    it('preserves the string value', () => {
      const id = createEpisodeId('episode-1');
      
      expect(typeof id).toBe('string');
      expect(id.toString()).toBe('episode-1');
    });
  });

  describe('Type Safety', () => {
    it('CharacterId and EpisodeId are distinct types at compile time', () => {
      const charId = createCharacterId('1');
      const epId = createEpisodeId('1');

      // At runtime they're just strings, but TypeScript enforces type safety
      expect(charId).toBe('1');
      expect(epId).toBe('1');
    });

    it('handles empty strings', () => {
      const charId = createCharacterId('');
      const epId = createEpisodeId('');

      expect(charId).toBe('');
      expect(epId).toBe('');
    });
  });
});
