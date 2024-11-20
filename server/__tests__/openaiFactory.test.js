const { Configuration, OpenAIApi } = require('openai');
const openAIServiceFactory = require('../services/openaiFactory');

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                recipe: {
                  title: "Test Recipe",
                  ingredients: ["ingredient1", "ingredient2"],
                  instructions: ["step1", "step2"]
                }
              })
            }
          }]
        })
      }
    }
  }));
});

describe('OpenAI Service Factory', () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  describe('Recipe Service', () => {
    it('should create recipe service with valid parameters', () => {
      const service = openAIServiceFactory.createService('recipe', {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: [],
        difficulty: 'medium'
      });
      expect(service).toBeDefined();
    });

    it('should execute recipe generation successfully', async () => {
      const service = openAIServiceFactory.createService('recipe', {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: [],
        difficulty: 'medium'
      });
      const result = await service.execute();
      const parsedResult = JSON.parse(result);
      expect(parsedResult).toHaveProperty('recipe');
      expect(parsedResult.recipe).toHaveProperty('title');
      expect(parsedResult.recipe).toHaveProperty('ingredients');
      expect(parsedResult.recipe).toHaveProperty('instructions');
    });

    it('should handle dietary restrictions', async () => {
      const service = openAIServiceFactory.createService('recipe', {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: ['vegetarian'],
        difficulty: 'easy'
      });
      const result = await service.execute();
      expect(result).toBeDefined();
    });

    it('should handle difficulty levels', async () => {
      const service = openAIServiceFactory.createService('recipe', {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: [],
        difficulty: 'hard'
      });
      const result = await service.execute();
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid service type', () => {
      expect(() => {
        openAIServiceFactory.createService('invalid', {});
      }).toThrow();
    });

    it('should throw error for missing ingredients', () => {
      expect(() => {
        openAIServiceFactory.createService('recipe', {
          dietaryRestrictions: [],
          difficulty: 'medium'
        });
      }).toThrow();
    });

    it('should handle OpenAI API errors', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const service = openAIServiceFactory.createService('recipe', {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: [],
        difficulty: 'medium'
      });

      await expect(service.execute()).rejects.toThrow('API Error');
    });
  });
});
