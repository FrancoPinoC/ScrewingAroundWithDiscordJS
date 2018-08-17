const { Listener } = require('discord-akairo');

class CooldownListener extends Listener {
  constructor() {
    super('commandCooldown', {
      emitter: 'commandHandler',
      eventName: 'commandCooldown'
    });
  }

  exec(message, command, remaining) {
    // If the command is on cooldown, we'd likely prefer if the bot didn't spam the channel with one message
    // per failed command, so let's DM the author. Possible alternative: Set up a way to send one message
    // the first time the command fails, and then just react to the messages until the cooldown resets
    // (wait is that what "once" is for?... oh well)
    message.react("☃");
    return message.author.send(
        `Your use of **${command}** is on cooldown.\n(remaining time: ${remaining / 1000} seconds)`);
  }
}

module.exports = CooldownListener;