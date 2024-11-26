const BaseCommand = require("./BaseCommand");

class GetPantryNamesCommand extends BaseCommand {
  constructor(model) {
    super();
    this.model = model;
  }

  async execute() {
    return (await this.model.find({}, "PantryName")).map((pantry) => pantry.PantryName);
  }
}

module.exports = GetPantryNamesCommand;
