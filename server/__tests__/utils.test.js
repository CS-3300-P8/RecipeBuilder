const { validatePrompt, sanitizeInput, formatRecipeResponse } = require('../utils');

describe('Utility Functions', () => {
  describe('validatePrompt', () => {
    it('should validate non-empty string prompts', () => {
      expect(validatePrompt('valid prompt')).toBe('valid prompt');
    });

    it('should trim whitespace from prompts', () => {
      expect(validatePrompt('  test  ')).toBe('test');
    });

    it('should throw error for empty prompts', () => {
      expect(() => validatePrompt('')).toThrow('Invalid prompt');
    });

    it('should throw error for non-string prompts', () => {
      expect(() => validatePrompt(null)).toThrow('Invalid prompt');
      expect(() => validatePrompt(undefined)).toThrow('Invalid prompt');
      expect(() => validatePrompt(123)).toThrow('Invalid prompt');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });

    it('should preserve safe characters', () => {
      expect(sanitizeInput('Hello, World!')).toBe('Hello, World!');
    });
  });

  describe('formatRecipeResponse', () => {
    it('should format valid recipe response', () => {
      const rawResponse = JSON.stringify({
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2']
      });

      const formatted = formatRecipeResponse(rawResponse);
      expect(formatted).toEqual({
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2']
      });
    });

    it('should handle missing fields', () => {
      const rawResponse = JSON.stringify({});
      const formatted = formatRecipeResponse(rawResponse);
      expect(formatted).toEqual({
        title: 'Untitled Recipe',
        ingredients: [],
        instructions: []
      });
    });

    it('should handle invalid JSON', () => {
      expect(() => formatRecipeResponse('invalid json')).toThrow('Failed to parse recipe response');
    });

    it('should handle non-array ingredients and instructions', () => {
      const rawResponse = JSON.stringify({
        title: 'Test',
        ingredients: 'not an array',
        instructions: 123
      });

      const formatted = formatRecipeResponse(rawResponse);
      expect(formatted).toEqual({
        title: 'Test',
        ingredients: [],
        instructions: []
      });
    });
  });
});
