const BaseCommand = require("./BaseCommand");
//const {Pantry, openai_factory} = require("../index");

class RetrieveCurrentPantryCommand extends BaseCommand {
  constructor(model) {
    super();
    this.model = model;
  }

  async execute() {
    try {
      console.log("Command: Get Curr Pantry");
      let currentPantry = await this.model.findOne({ current: true });

      if (!currentPantry) {
        console.log("No current pantry set.");
        throw new Error("No current pantry set.");
      }

      console.log("test");
      console.log(currentPantry);

      return {
        pantryName: currentPantry.PantryName,
        ingredients: currentPantry.ingredients || [],
      };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = RetrieveCurrentPantryCommand;
