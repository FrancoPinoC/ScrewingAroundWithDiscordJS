const { Listener } = require('discord-akairo');
const randoNoGood = require('../utils').randoNoGood;

class commandBlockedListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked'
    });
  }

  exec(message, command, reason) {
    if(reason === "owner") {
      message.channel.send(`${message.author}, just who the hell do you think you are?`);
    }
    else {
      message.react(randoNoGood());
    }

  }
}

module.exports = commandBlockedListener;