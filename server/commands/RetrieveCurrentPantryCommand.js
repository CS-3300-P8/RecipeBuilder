const BaseCommand = require("./BaseCommand");
//const {Pantry, openai_factory} = require("../index");

class RetrieveCurrentPantryCommand extends BaseCommand {
  constructor(model) {
    super();
    this.model = model;
  }

  async execute() {
    try {
      const currentPantry = await this.model.findOne({ current: true });

      if (!currentPantry) {
        throw new Error("No current pantry set.");
      }

      return {
        pantryName: currentPantry.PantryName,
        ingredients: currentPantry.ingredients || [],
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = RetrieveCurrentPantryCommand;
