const { Command } = require('discord-akairo');
const CONFIG = require("../../public-config.json");

class KillCommand extends Command {
  constructor() {
    super('kill', {
      aliases: ['kill']
    });
  }

  // TODO Put this in just the one function so it's reusable... also maybe this commands belong in a "owners" folder
  userPermissions(message) {
    let owners = CONFIG.owners;
    if(!owners.includes(message.author.id)) {
      message.reply("Just who do you think you are.");
      return false;
    }
    return true;
  }

  exec(message) {
    message.reply('Uncool!');
    return this.client.destroy();
  }
}


module.exports = KillCommand;