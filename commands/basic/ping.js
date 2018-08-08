const { Command } = require('discord-akairo');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    });
  }

  async exec(message) {
    const m = await message.channel.send("Pinging...");
    m.edit(
        `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. 
        API Latency is ${Math.round(this.client.ping)}ms`
    );
  }
}

module.exports = PingCommand;