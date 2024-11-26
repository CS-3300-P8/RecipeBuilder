// commands/AddIngredientCommand.js
const BaseCommand = require("./BaseCommand");

class AddIngredientCommand extends BaseCommand {
  constructor(model, pantryName, ingredient) {
    super();
    this.model = model;
    this.pantryName = pantryName; // Name of the pantry to which the ingredient will be added
    this.ingredient = ingredient; // Ingredient to add (object with name and category)
  }

  async execute() {
    // Find the pantry by name
    console.log("Inside Command Execute");
    const pantry = await this.model.findOne({ PantryName: this.pantryName });
    if (!pantry) {
      throw new Error(`Pantry '${this.pantryName}' not found.`);
    }
    console.log("Retrieved from pantry");
    // Check if the ingredient already exists
    const ingredientExists = pantry.ingredients.some(
      (ing) => ing.name.toLowerCase() === this.ingredient.name.toLowerCase()
    );
    if (ingredientExists) {
      throw new Error(`Ingredient '${this.ingredient.name}' already exists in the pantry.`);
    }

    // Add the ingredient to the pantry
    pantry.ingredients.push(this.ingredient);

    // Save the updated pantry
    const updatedPantry = await pantry.save();

    // Return the updated pantry
    return updatedPantry;
  }
}

module.exports = AddIngredientCommand;
