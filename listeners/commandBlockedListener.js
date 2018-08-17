const { Listener } = require('discord-akairo');
const randoNoGood = require('../utils').randoNoGood;

class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked'
    });
  }

  exec(message, command, reason) {
    if(reason === "owner") {
      message.channel.send(`${message.author}, just who the hell do you think you are?`);
    }
    else {
      console.log(reason);
      message.react(randoNoGood());
    }
  }
}

module.exports = CommandBlockedListener;