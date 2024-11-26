const BaseCommand = require("./BaseCommand");

class CreatePantryCommand extends BaseCommand {
  constructor(model, pantryName) {
    super();
    this.model = model;
    this.pantryName = pantryName;
  }

  async execute() {
    try {
      if (await this.model.findOne({ PantryName: this.pantryName })) {
        throw new Error("Pantry already exists.");
      }

      return await this.model.create({ PantryName: this.pantryName, ingredients: [] });;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = CreatePantryCommand;
