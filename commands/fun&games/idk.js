const { Command } = require('discord-akairo');

const spriteStates = {
  "default":"🤷",
  "left":"🙋",
  "up":"🤦",
  "down":"🙅",
  "right":"💁"
};

const controller = {
  "default": "⏺",
  "left":"⬅",
  "up":"⬆",
  "down":"⬇",
  "right":"➡",
  "exit": "❌"
};

class ControllerCommand extends Command {
  constructor() {
    super('control', {
      aliases: ['control', 'game', 'toy']
    });
  }

  async exec(message) {
    if(!this.client.game) {
      this.client.game = {
        on: true,
        loading: false,
        state: "default"
      }
    }
    else {
      return message.channel.send("Sorry! A game is already in progress");
    }
    let gameMess = await message.channel.send(spriteStates["default"]);
    await gameMess.react(controller.default);
    await gameMess.react(controller.left);
    await gameMess.react(controller.up);
    await gameMess.react(controller.down);
    await gameMess.react(controller.right);
    await gameMess.react(controller.exit);
    console.log(Object.values(controller));

    const filter = (reaction, user) => {
      return Object.values(controller).includes(reaction.emoji.name)
          && (this.client.game.loading === false)
          && user.id !== "476491679508201492";
    };

    // Use await instead. Also make a function? Also use a while to keep awaiting for reactions. Also... idk
    gameMess.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] })
        .then(collected => {
          console.log("Hey");
          console.log(collected);
          const reaction = collected.first();

          if (reaction.emoji.name === controller.up) {
            console.log("reacted!");
            this.client.game.loading = true;
            gameMess.edit(spriteStates.up).then(() => this.client.game.loading = false).catch(error => {console.log(error);});
          }
          else if (reaction.emoji.name === controller.down) {
            this.client.game.loading = true;
            gameMess.edit(spriteStates.down).then(() => this.client.game.loading = false);
          }
        })
        .catch(collected => {
          console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
          message.reply('you didn\'t react with neither a thumbs up, nor a thumbs down.');
          this.client.game = undefined;
        });
    // gameMess.edit(
    //     `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.
    //     API Latency is ${Math.round(this.client.ping)}ms`
    // );
  }
}

module.exports = ControllerCommand;