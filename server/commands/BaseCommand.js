// commands/BaseCommand.js
class BaseCommand {
    async execute() {
      throw new Error("Execute method must be implemented in derived classes.");
    }
  }
  
module.exports = BaseCommand;
  