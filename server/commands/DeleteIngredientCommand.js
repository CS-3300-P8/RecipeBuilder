const BaseCommand = require("./BaseCommand");

class DeleteIngredientCommand extends BaseCommand {
  constructor(model, pantryName, ingredient) {
    super();
    this.model = model;
    this.pantryName = pantryName;
    this.ingredient = ingredient;
  }

  async execute() {
    try {

      const pantry = await this.model.findOne({ PantryName: this.pantryName });
      
      if (!pantry) {
        throw new Error("Pantry not found.");
      }

      // Find the index of the ingredient to delete
      const ingredientIndex = pantry.ingredients.findIndex(
        (ingredient) =>
          ingredient.name.toLowerCase() === this.ingredient.toLowerCase()
      );

      if (ingredientIndex === -1) {
        throw new Error(
          "Ingredient not found in the pantry."
        );
      }

      pantry.ingredients.splice(ingredientIndex, 1);
      await pantry.save();

      return this.ingredient;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DeleteIngredientCommand;