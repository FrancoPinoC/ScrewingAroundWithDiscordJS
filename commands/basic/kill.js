const { Command } = require('discord-akairo');

class KillCommand extends Command {
  constructor() {
    super('kill', {
      aliases: ['kill']
    });
  }

  exec(message) {
    message.reply('Uncool!');
    return this.client.destroy();
  }
}


module.exports = KillCommand;