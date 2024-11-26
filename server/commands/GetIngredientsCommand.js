const BaseCommand = require("./BaseCommand");

class GetIngredientsCommand extends BaseCommand {
  constructor(model, pantryName) {
    super();
    this.model = model;
    this.pantryName = pantryName;
  }

  async execute() {
    try {
      if (!this.pantryName) {
        throw new Error("Pantry name is required.");
      }

      const pantry = await this.model.findOne({ PantryName: this.pantryName });

      if (!pantry) {
        throw new Error(`Pantry not found.`);
      }

      return pantry.ingredients;
    } catch (error) {
      throw error;
    }
  }
}


module.exports = GetIngredientsCommand;
