const { Listener } = require('discord-akairo');

class CommandErrorListener extends Listener {
  constructor() {
    super('error', {
      emitter: 'commandHandler',
      eventName: 'error'
    });
  }

  exec(error, message, command) {
    message.channel.send(`OH NO WE'RE ALL GONNA D-. I mean, please tell the bot tamers something went wrong.`);
    console.log(`${message.author} tried to use ${command} and well...`);
    console.log(error);
    console.log("\n- - - - - - - - - - - - - - - - -\n");
  }
}

module.exports = CommandErrorListener;