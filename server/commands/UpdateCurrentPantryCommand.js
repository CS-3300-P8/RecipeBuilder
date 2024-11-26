const BaseCommand = require("./BaseCommand");
//const {Pantry, openai_factory} = require("../index");

class UpdateCurrentPantryCommand extends BaseCommand {
  constructor(model, pantryName) {
    super();
    this.model = model;
    this.pantryName = pantryName;
  }

  async execute() {
    try {
      console.log("Updated Current Pantry");
      if (!this.pantryName) {
        return res.status(400).send({ error: "Pantry name is required." });
      }
    
      await this.model.updateMany({}, { current: false });

      let current_pantries = await this.model.findOneAndUpdate(
        { PantryName: this.pantryName },
        { current: true },
        { new: true }
      );
      
      if (!current_pantries) {
        console.log({error: "Pantry not found."});
        throw new Error({error: "Pantry not found."});
      }

      console.log("Test");
      console.log(current_pantries);

      return current_pantries;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UpdateCurrentPantryCommand;
