// Base class for OpenAI service requests
class OpenAIService {
    constructor(openai) {
      this.openai = openai;
    }
  
    async execute() {
      throw new Error('Execute method must be implemented');
    }
  }
  
  // Concrete class for ingredient normalization
  class IngredientNormalizationService extends OpenAIService {
    constructor(openai, ingredientName) {
      super(openai);
      this.ingredientName = ingredientName;
    }
  
    async execute() {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that normalizes ingredient names and provides category information. 
            For the given ingredient, provide:
            1. The normalized ingredient name
            2. Its category (e.g., Vegetables, Fruits, Proteins, Dairy, etc.)
            3. 2-3 similar ingredients
            
            Format your response as JSON with the following structure:
            {
              "normalizedName": "standard ingredient name",
              "category": "ingredient category",
              "similarIngredients": ["similar1", "similar2", "similar3"]
            }
            
            Keep responses concise and focused on common cooking ingredients.`,
          },
          {
            role: "user",
            content: `Normalize this ingredient: "${query}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });
  
      return completion.choices[0].message.content;
    }
  }
  
  // Concrete class for recipe generation
  class RecipeGenerationService extends OpenAIService {
    constructor(openai, ingredients, dietaryRestrictions, difficulty) {
      super(openai);
      this.ingredients = ingredients;
      this.dietaryRestrictions = dietaryRestrictions;
      this.difficulty = difficulty;
    }
  
    async execute() {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful chef that generates recipes based on available ingredients. 
            Generate a recipe that:
            1. Uses as many of the provided ingredients as possible
            2. Clearly indicates which ingredients are available and which need to be purchased
            3. Matches the specified dietary restrictions and difficulty level
            
            Format your response as JSON with the following structure:
            {
              "name": "Recipe Name",
              "availableIngredients": ["ingredient1", "ingredient2"],
              "missingIngredients": ["ingredient3", "ingredient4"],
              "instructions": ["step1", "step2"],
              "prepTime": "X minutes",
              "cookingTime": "Y minutes",
              "difficulty": "easy/medium/hard",
              "servings": "Z"
            }`
          },
          {
            role: "user",
            content: `Generate a recipe with these parameters:
            Available ingredients: ${JSON.stringify(this.ingredients)}
            Dietary restrictions: ${this.dietaryRestrictions}
            Difficulty level: ${this.difficulty}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });
  
      return completion.choices[0].message.content;
    }
  }
  
  // Factory class for creating OpenAI services
  class OpenAIServiceFactory {
    constructor(openai) {
      this.openai = openai;
    }
  
    createService(type, params) {
      switch (type) {
        case 'normalize':
          return new IngredientNormalizationService(this.openai, params.ingredientName);
        case 'recipe':
          return new RecipeGenerationService(
            this.openai,
            params.ingredients,
            params.dietaryRestrictions,
            params.difficulty
          );
        default:
          throw new Error(`Unknown service type: ${type}`);
      }
    }
  }
  
  module.exports = OpenAIServiceFactory;