const OpenAI = require('openai');

class OpenAIService {
  constructor(openai, options) {
    this.openai = openai;
    this.options = options;
  }

  async execute() {
    throw new Error('Not implemented');
  }
}

class RecipeService extends OpenAIService {
  constructor(openai, options) {
    super(openai, options);
    this.validateOptions(options);
  }

  validateOptions(options) {
    if (!options.ingredients || !Array.isArray(options.ingredients)) {
      throw new Error('Invalid ingredients: must be an array');
    }
    if (options.ingredients.length === 0) {
      throw new Error('Invalid ingredients: array cannot be empty');
    }
  }

  async execute() {
    const { ingredients, dietaryRestrictions, difficulty } = this.options;
    
    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}. 
                   Dietary restrictions: ${dietaryRestrictions?.join(', ') || 'none'}. 
                   Difficulty level: ${difficulty || 'medium'}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant that generates recipes."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return response.choices[0].message.content;
  }
}

const createOpenAIInstance = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({ apiKey });
};

const openAIServiceFactory = {
  createService(type, options) {
    const openai = createOpenAIInstance();

    switch (type) {
      case 'recipe':
        return new RecipeService(openai, options);
      default:
        throw new Error(`Unknown service type: ${type}`);
    }
  }
};

module.exports = openAIServiceFactory;
