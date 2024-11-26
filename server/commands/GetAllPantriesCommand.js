const BaseCommand = require("./BaseCommand");

class GetAllPantriesCommand extends BaseCommand {
  constructor(model) {
    super();
    this.model = model;
  }

  async execute() {
    const pantries = await this.model.find(); // Retrieve all pantries
    return pantries;
  }
}

module.exports = GetAllPantriesCommand;
