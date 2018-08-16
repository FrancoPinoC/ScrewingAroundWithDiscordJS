const { Command } = require('discord-akairo');
const CONFIG = require("../../public-config.json");

class KillCommand extends Command {
  constructor() {
    super('kill', {
      aliases: ['kill'],
      ownerOnly: true
    });
  }

  exec(message) {
    message.channel.send('Uncool!');
    return this.client.destroy();
  }
}


module.exports = KillCommand;