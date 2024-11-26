const BaseCommand = require("./BaseCommand");
//const {Pantry, openai_factory} = require("../index");

class UpdateCurrentPantryCommand extends BaseCommand {
  constructor(model, pantryName, ingredient) {
    super();
    this.model = model;
    this.pantryName = pantryName;
  }

  async execute() {
    try {
      if (!pantryName) {
        return res.status(400).send({ error: "Pantry name is required." });
      }
    
      await this.model.updateMany({}, { current: false });

      let current_pantries = await this.model.findOneAndUpdate(
        { PantryName: pantryName },
        { current: true },
        { new: true }
      );
      
      if (!current_pantries) {
        throw new Error({error: "Pantry not found."});
      }

      return current_pantries;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UpdateCurrentPantryCommand;
