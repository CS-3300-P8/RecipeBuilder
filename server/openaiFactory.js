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
            content: `Normalize this ingredient: "${this.ingredientName}"`,  // 
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
    constructor(openai, ingredients, dietaryRestrictions, style, types, difficulty) {
      super(openai);
      this.ingredients = ingredients;
      this.dietaryRestrictions = dietaryRestrictions;
      this.style = style;
      this.types = types;
      this.difficulty = difficulty;
    }
  
    async execute() {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
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
              "style": "Style of Food",
              "types": "Types of Food",
              "difficulty": "${this.difficulty}",
              "servings": "Z"
            }
            Ensure all ingredients listed are either in availableIngredients or missingIngredients.
            Make the recipe complexity match the specified difficulty level.
            Follow any dietary restrictions specified.
            Example of style (this.style) or Style of Meal is American, Cajun, or Italian Food. Ensure this recipe can be classified under this style.
            The types (this.types) are Breakfast, Lunch, or Dinner. Ensure the recipe can be classified under this type`
          },
          {
            role: "user",
            content: `Generate a recipe with these parameters:
            Available ingredients: ${this.ingredients.join(', ')}
            Dietary restrictions: ${this.dietaryRestrictions}
            Style of Food: ${this.style}
            Type of Food: ${this.types}
            Difficulty level: ${this.difficulty}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
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
      console.log("OpenAIServiceFactory.createService", type, params);
      switch (type) {
        case 'normalize':
          return new IngredientNormalizationService(this.openai, params.ingredientName);
        case 'recipe':
          return new RecipeGenerationService(
            this.openai,
            params.ingredients,
            params.dietaryRestrictions,
            params.style,
            params.types,
            params.difficulty
          );
        default:
          throw new Error(`Unknown service type: ${type}`);
      }
    }
  }
  
  module.exports = OpenAIServiceFactory;